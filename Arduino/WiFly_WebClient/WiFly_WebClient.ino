
// (Based on Ethernet's WebClient Example)

#include "WiFly.h"






//Client client(server, 80);


Server server(80);
void setup() {

  Serial.begin(9600);

  WiFly.begin();

  if (!WiFly.join("Beduu", "fbedulli4")) {
    Serial.println("Association failed.");
    while (1) {
      // Hang on failure.
    }
  }  
  server.begin();


}

void tryToConnect(){
  Client client("192.168.1.100", 3000);
  //Serial.println("connecting...");

  if (client.connect()) {
    //Serial.println("connected");
    client.println("GET / HTTP/1.0");
    client.println();
  } 
  else {
    //Serial.println("connection failed");
  }


  while(client.available()) {
    char c = client.read();
  }


 // Serial.println();
  Serial.println("disconnecting.");
  client.stop();



}



void loop() {

tryToConnect();


}



