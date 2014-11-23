//This code send a message from the arduino to the server when something appen
//The respost of the server is not keep 

#include "WiFly.h"
#define HeadLength 50
#define actionInDigLength 4
#define actionInAnalogLength 3
#define DEBUG true
#define ID "1111111111"
#define Type "OUTPUT"
#define PIN "2=o,3=o,4=o,5=o,6=o,7=o,8=o,9=o"

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
    while (1) {
    }
  }
  onlyOneTimePleas();
  Serial.print("IP: ");
  Serial.println(WiFly.ip());
  setPinMode();
}




void updateInput(){

  boolean change=false;
  for(byte i=0;i<actionInDigLength;i++){
    int readVal=digitalRead((int)(actionInDig[i]-'0'));
    if(readVal==0){
      actionInDigStatusClick[i]++;
    }
    else if(readVal==1 && actionInDigStatusClick[i]>=1){
      actionInDigStatusClick[i]=0;
      actionInDigStatus[i]= actionInDigStatus[i]==LOW?HIGH:LOW;
      change=true;
    }
  }
  if(change){
Client client("192.168.1.101", 3015);
   
    Serial.println("connecting...");

    if (client.connect()) {
      Serial.println("connected");
      client.println("GET /  HTTP/1.0");
      client.println("Host: 192.168.1.102");
      client.println("Content-Length:34 ");
      //TODO
      //Compute the content-length dynamic, using char[]
      client.println();
      client.print("{ID:[");
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
          client.println();
          client.println();
    } 
    else {
      
      Serial.println("connection failed");
    }
    while(client.available()) {
      char c = client.read();
    }
    Serial.println();
   
    Serial.println("disconnecting.");

    client.stop();
  }
}







void loop() {  
   updateInput();
}






