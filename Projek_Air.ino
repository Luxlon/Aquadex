#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DFRobot_PH.h"
#include <EEPROM.h>

#define ONE_WIRE_BUS 4           // Pin Sensor Suhu
#define TURBIDITY_SENSOR_PIN 35  // Pin analog untuk sensor turbidity
#define RELAY_PIN 22             // Pin relay pompa
#define pHMeterPin 34            // GPIO34 (ADC pin) untuk pH meter
#define Offset 0.04              // Deviation compensate
#define LED 2                    // GPIO2 sebagai indikator LED pada ESP32
#define samplingInterval 20
#define printInterval 800
#define ArrayLenth 40            // Times of collection

#define SENSOR 23  // Pin water flow

#define RELAY_PIN_1 26  // Pin GPIO untuk relay pompa pertama
#define RELAY_PIN_2 25  // Pin GPIO untuk relay pompa kedua
#define BUTTON_PIN 27   // Pin GPIO untuk tombol pompa

bool relayState = false;  // Menyimpan status relay (false = mati, true = nyala)
int pHArray[ArrayLenth];  // Store the average value of the sensor feedback
int pHArrayIndex = 0;

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Inisialisasi variabel untuk flow water
long currentMillis = 0;
long previousMillis = 0;
int interval = 1000;
float calibrationFactor = 4.5;
float voltage,phValue,temperature = 25;
DFRobot_PH ph;
volatile byte pulseCount;
byte pulse1Sec = 0;
float flowRate;
unsigned int flowMilliLitres;
unsigned long totalMilliLitres;

// Informasi Wi-Fi
const char* ssid = "Luxion";
const char* password = "87654321";

// Informasi Broker MQTT
const char* mqttServer = "76397f75035a455399199a08f3b33bb8.s1.eu.hivemq.cloud";
const int mqttPort = 8883;
const char* mqttUser = "Aquadex123";
const char* mqttPassword = "Aquadex123";
const char* mqttTopic = "Aquadex";
const char* mqttActionTopic = "Action";  // Topic untuk menerima perintah on/off

// Membuat objek WiFi dan MQTT client
WiFiClientSecure espClient;
PubSubClient client(espClient);

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);
  sensors.begin();
  ph.begin();

  // Inisialisasi pin relay tambahan dan tombol
  pinMode(RELAY_PIN_1, OUTPUT);
  pinMode(RELAY_PIN_2, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  digitalWrite(RELAY_PIN_1, LOW);
  digitalWrite(RELAY_PIN_2, LOW);

  // Inisialisasi pin untuk sensor air
  pinMode(SENSOR, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);  // Set pin sebagai output
  digitalWrite(RELAY_PIN, LOW);  // Default mati

  pulseCount = 0;
  flowRate = 0.0;
  flowMilliLitres = 0;
  totalMilliLitres = 0;
  previousMillis = 0;

  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);

  // Koneksi Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");

  // Nonaktifkan verifikasi sertifikat TLS
  espClient.setInsecure();

  // Konfigurasi MQTT
  client.setServer(mqttServer, mqttPort);
  client.setCallback(mqttCallback);  // Menetapkan callback untuk menerima pesan

  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("Connected");
      client.subscribe(mqttActionTopic);  // Subscribe ke topic Action
    } else {
      Serial.print("Failed. Error Code: ");
      Serial.println(client.state());
      delay(2000);
    }
  }

  // Serial.println("Program dimulai. Relay siap dikendalikan dengan tombol.");
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Pengambilan data dari sensor
  float pHValue = readPH();
  int turbidityRaw = analogRead(TURBIDITY_SENSOR_PIN);
  int turbidity = convertTurbidity(turbidityRaw, 200, 3000);
  waterflow();

  sensors.requestTemperatures(); // Meminta suhu dari sensor
  float temperature = sensors.getTempCByIndex(0); // Membaca suhu (Celsius)

  // Serial.print("Temperature (C): ");
  // Serial.println(temperature);

  delay(1000);

  // Kirim data ke MQTT
  sendDataToMQTT(pHValue, turbidity, flowRate, totalMilliLitres, temperature);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  // Fungsi ini akan dipanggil saat pesan diterima dari broker MQTT
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.print("Message received: ");
  Serial.println(message);

  // Cek pesan yang diterima untuk mengendalikan relay
  if (String(topic) == mqttActionTopic) {
    if (message == "on") {
      relayState = true;
      digitalWrite(RELAY_PIN_1, LOW);  // Nyalakan relay
      digitalWrite(RELAY_PIN_2, LOW);  // Nyalakan relay
    } else if (message == "off") {
      relayState = false;
      digitalWrite(RELAY_PIN_1, HIGH); // Matikan relay
      digitalWrite(RELAY_PIN_2, HIGH); // Matikan relay
    }
  }
}

float readPH() {
  static unsigned long samplingTime = millis();
  static float voltage, phValue;

  // Sampling interval untuk pengukuran pH
  if (millis() - samplingTime > samplingInterval) {
    // Membaca data sensor dan menyimpan ke array
    pHArray[pHArrayIndex++] = analogRead(pHMeterPin);
    if (pHArrayIndex == ArrayLenth) pHArrayIndex = 0;

    // Menghitung voltase dari nilai ADC
    voltage = avergearray(pHArray, ArrayLenth) * 5.0 / 1024;

    // Konversi voltase menjadi nilai pH
    phValue = 3.5 * voltage + Offset;

    samplingTime = millis(); // Reset waktu sampling
  }

  // Tampilkan data pH ke Serial Monitor (opsional)
  Serial.print("Voltage: ");
  Serial.print(voltage, 2);
  Serial.print(" V, pH Value: ");
  Serial.println(phValue, 2);

  return phValue; // Mengembalikan nilai pH
}


void waterflow() {
  currentMillis = millis();
  if (currentMillis - previousMillis > interval) {
    pulse1Sec = pulseCount;
    pulseCount = 0;

    flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) / calibrationFactor;
    previousMillis = millis();
    flowMilliLitres = (flowRate / 60) * 1000;
    totalMilliLitres += flowMilliLitres;
  }
}

double avergearray(int* arr, int number) {
  long amount = 0;
  int min, max;

  if (number <= 0) return 0;
  if (number < 5) {
    for (int i = 0; i < number; i++) amount += arr[i];
    return (double)amount / number;
  }

  min = arr[0];
  max = arr[1];
  for (int i = 2; i < number; i++) {
    if (arr[i] < min) {
      amount += min;
      min = arr[i];
    } else if (arr[i] > max) {
      amount += max;
      max = arr[i];
    }
  }
  return (double)amount / (number - 2);
}

int convertTurbidity(int rawValue, int rawMin, int rawMax) {
  // Batasi rawValue agar tetap dalam rentang
  if (rawValue < rawMin) rawValue = rawMin;
  if (rawValue > rawMax) rawValue = rawMax;

  // Hitung nilai skala 0-100
  return map(rawValue, rawMin, rawMax, 50, 0);
}

void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Reconnecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)) {
      Serial.println("Connected");
      client.subscribe(mqttActionTopic);  // Subscribe ke topic Action
    } else {
      Serial.print("Failed. Error Code: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void sendDataToMQTT(float pH, int turbidity, float flow, unsigned long total, float temperature) {
  String data = "{\"pH\":" + String(pH, 2) +
                ",\"Turbidity\":" + String(turbidity) +
                ",\"FlowRate\":" + String(flow, 2) +
                ",\"TotalMilliLitres\":" + String(total) +
                ",\"Suhu\":" + String(temperature, 2) + "}";
  client.publish(mqttTopic, data.c_str());
  Serial.println(data);
}