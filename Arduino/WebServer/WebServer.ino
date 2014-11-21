#include "WiFly.h"
#define HeadLength 50
#define actionInDigLength 4
#define actionInAnalogLength 3

Server server(80);
char* stringOne;
char actionInDig[]={
  '2','3','4','5'};



char actionInDigStatus[]={
  LOW,LOW,LOW,LOW
};

byte actionInDigStatusClick[]={
  0,0,0,0
};
char* actionInAnalog[5]={
  "A0","A1","A2"};


 
 
 
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

void setPinMode(){
  
  for(byte i=0;i<actionInDigLength;i++){
    pinMode((int)(actionInDig[i]-'0'),INPUT_PULLUP); 
  }
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
  server.begin();
}


void updateInput(){
  for(byte i=0;i<actionInDigLength;i++){
    int readVal=digitalRead((int)(actionInDig[i]-'0'));
    if(readVal==0){
      actionInDigStatusClick[i]++;
    }
    else if(readVal==1 && actionInDigStatusClick[i]>=1){
      actionInDigStatusClick[i]=0;
      actionInDigStatus[i]= actionInDigStatus[i]==LOW?HIGH:LOW;
    }
  }
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
          client.print("{");
          client.print("OD:[");
          for(byte i=0;i<actionOutDigLength;i++){
            if(i!=0){
              client.print(",");
            }
            client.print("{p");
            client.print(actionOutDig[i]);
            client.print(":");
            client.print(actionOutDigStatus[i]==HIGH?"t":"f");
            client.print("}");
          }
          client.print("]");
          client.print("ID:[");
          for(byte i=0;i<actionInDigLength;i++){
            if(i!=0){
              client.print(",");
            }
            client.print("{p");
            client.print(actionInDig[i]);
            client.print(":");
            client.print(actionInDigStatus[i]==HIGH?"t":"f");
            client.print("}");
          }
          client.print("]");
          client.print("}");
          client.print("end");
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





