//This code send a message from server to client to change behaviour of arduino's pin
//TODO
//The server can send also the current status if require!
#include "WiFly.h"
#define HeadLength 50
#define ID "1111111111"
#define Type "OUTPUT"
#define PIN "2=o,3=o,4=o,5=o,6=o,7=o,8=o,9=o"
#define actionOutDigLength 8
#define actionOutAnalogLength 3



Server server(80);

char* stringOne;

char actionOutDig[]={
  '4','2','3','5','6','7','8','9'};

char actionOutDigStatus[]={
  LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW};  
char actionInDigStatus[]={
  LOW,LOW,LOW,LOW
};


 
 
 
int indexOf(char *in,char* wt,int matchLength,byte from){
  int wIndex=0;
  for(int i=from;i<HeadLength;i++){
    if(in[i]==wt[wIndex]){
      wIndex++;
      if(wIndex>=matchLength){
        return i-matchLength+1;
      }
    }
    else{
      wIndex=0;
    }
  }
  return -1;
}


//Set up the pin as output(pin must be from 0 to 9, 10 - 13 are used by WiFly)
//analog pin don't need to be set
void setPinMode(){
  for(byte i=0;i<actionOutDigLength;i++){
    pinMode((int)actionOutDig[i]-'0',OUTPUT); 
  }
}


//Manage the Output Pin Digital
void modStatusPin(char* in){

  
  for(byte i=0;i<actionOutDigLength;i++){
    char helper[4]="p";
    helper[1]=actionOutDig[i];
    helper[2]='=';
    helper[3]='t';
    if(indexOf(in,helper,4,0)!=-1){
      digitalWrite((int)actionOutDig[i]-'0',HIGH);
      actionOutDigStatus[i]=HIGH;
    }
    helper[3]='f';
    if(indexOf(in,helper,4,0)!=-1){
      digitalWrite((int)actionOutDig[i]-'0',LOW);
      actionOutDigStatus[i]=LOW;
    }
    helper[3]='s';
    if(indexOf(in,helper,4,0)!=-1){ 
      actionOutDigStatus[i]=actionOutDigStatus[i]==HIGH?LOW:HIGH;
      digitalWrite((int)actionOutDig[i]-'0',actionOutDigStatus[i]);
    }
  }
}


void onlyOneTimePleas(){
    Client client("192.168.1.101", 3005);
    Serial.println("connecting...");

    if (client.connect()) {
      Serial.println("connected");
      client.println("GET /  HTTP/1.0");
      client.println("Host: 192.168.1.102");
      client.println("Content-Length:67");
      client.println();
      
      client.print(WiFly.ip());
      client.println();
      client.print(ID);
      client.println();
      client.print(Type);
      client.println();
      client.print(PIN);
      client.print("    ");
      client.println();
      client.stop();
    }
     while(client.available()) {
      char c = client.read();
      
    }
    
    Serial.println("end...");

}





void setup() {
  Serial.begin(9600);
  stringOne=new char[HeadLength];
  WiFly.begin();
  if (!WiFly.join("Beduu", "fbedulli4")) {
    Serial.println("Association failed.");
    while (1) {}
  }
  
  Serial.print("IP: ");
  Serial.println(WiFly.ip());
  setPinMode();
  onlyOneTimePleas();
  server.begin();
}


void loop() {  
  Client client = server.available();
  if (client) {
    Serial.print("available");
    byte p=0;
    byte index=0;
    while (client.connected()) {
      if (client.available()) {
        char c=client.read();
        stringOne[index]=c;
        index++;

        if (c == 13 && p==0) {
          p++;
        }
        else if (c == 10 && p==1) {
        } 
        else if (c == 13 && p==1) {
          p++;
        }
        else if (c == 10 && p==2) {
          modStatusPin(stringOne);
          Serial.println("Message Send To Client");
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println();
          client.stop();
          index=0;
        }
        else{
          p=0;
        }
      }
    }

  }
}





