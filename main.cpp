#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>
#include <TFT_eSPI.h>
#include <Servo.h>
#include <Wire.h>
#include "Adafruit_TCS34725.h"

// Servo setup
const int SERVO_PIN = 2;
Servo myServo;

// T-Display setup
TFT_eSPI tft = TFT_eSPI();

// Color sensor setup
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);

const char* ssid = "";
const char* password = "";

const char* mqtt_server = "";
const char* mqtt_user = "";
const char* mqtt_password = "";
const int mqtt_port = 8883;

WiFiClientSecure espClient;
PubSubClient client(espClient);

const char* command_topic = "fitcheck/commands";
const char* color_topic = "fitcheck/color";

void publishColorReading() {
  uint16_t r, g, b, c;
  tcs.getRawData(&r, &g, &b, &c);
  
  DynamicJsonDocument doc(256);
  doc["r"] = r;
  doc["g"] = g;
  doc["b"] = b;
  
  char buffer[128];
  serializeJson(doc, buffer);
  
  client.publish(color_topic, buffer);
  Serial.print("Published color data: ");
  Serial.println(buffer);
}

// Function to map outfit name to a servo angle
int getServoAngle(const char* outfitName) {
  if (strcmp(outfitName, "White") == 0) return 30;
  if (strcmp(outfitName, "Shirt") == 0) return 90;
  if (strcmp(outfitName, "Pants") == 0) return 150;
  if (strcmp(outfitName, "Shoes") == 0) return 180;
  return 0;
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  
  tft.fillScreen(TFT_BLACK);
  tft.setCursor(0, 0);

  const char* outfitName = doc["outfitName"];
  const char* command = doc["command"];

  if (command && strcmp(command, "read_color") == 0) {
    tft.println("Reading color...");
    publishColorReading(); // Publish color when commanded
  } else if (outfitName) {
    tft.println("Suggested Outfit:");
    tft.println(outfitName);
    int angle = getServoAngle(outfitName);
    myServo.write(angle);
    Serial.print("Moving servo to angle: ");
    Serial.println(angle);
  } else {
    tft.println("Invalid payload.");
  }
}

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  tft.fillScreen(TFT_BLACK);
  tft.setCursor(0, 0);
  tft.println("Connected to WiFi!");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("LillyGoClient", mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(command_topic);
      tft.println("MQTT Connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" trying again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  tft.init();
  tft.setRotation(1);
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE, TFT_BLACK);
  tft.setTextSize(1);
  
  myServo.attach(SERVO_PIN);
  myServo.write(90);
  
  setup_wifi();
  
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  Wire.begin();
  if (tcs.begin()) {
    Serial.println("Found TCS34725 sensor");
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    tft.println("Color sensor not found.");
  }
}

void loop() {
  // Read the color sensor every 2 seconds
  static unsigned long lastReading = 0;
  if (millis() - lastReading > 2000) {
    uint16_t r, g, b, c;
    tcs.getRawData(&r, &g, &b, &c);
    
    // Print the raw sensor data.
    Serial.print("R: ");
    Serial.print(r);
    Serial.print(" G: ");
    Serial.print(g);
    Serial.print(" B: ");
    Serial.print(b);
    Serial.print(" C: ");
    Serial.println(c);

    lastReading = millis();
  }
}