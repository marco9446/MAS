//This code send a message from the arduino to the server when something appen
//The respost of the server is not keep 

#include "WiFly.h"

#define actionInDigLength 8
#define actionInAnalogLength 3
#define DEBUG true
#define ID "1111111112"
#define Type "INPUT "
#define PIN "2=b,3=b,4=b,5=b,6=s,7=s,8=w,9=w"

char actionInDig[]={
  '2','3','4','5','6','7','8','9'};



char actionInDigStatus[]={
  LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW
};

byte actionInDigStatusClick[]={
  0,0,0,0,0,0,0,0
};




void setPinMode(){
  
  for(byte i=0;i<actionInDigLength;i++){
    pinMode((int)(actionInDig[i]-'0'),INPUT_PULLUP); 
  }
}
void onlyOneTimePleas(){
 Client client("192.168.1.205", 3005);
    //Serial.println("connecting...");

    if (client.connect()) {
      //Serial.println("connected");
      client.println("GET /  HTTP/1.0");
      client.println("Host: 192.168.1.102");
      client.println("Content-Length:68");
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
    
    //Serial.println("end...");

}
void setup() {
 // Serial.begin(9600);
  WiFly.begin();
  if (!WiFly.join("ModularAutomationSystem", "fbedulli4")) {
    //Serial.println("Association failed.");
    while (1) {
    }
  }
  onlyOneTimePleas();
  //Serial.print("IP: ");
  //Serial.println(WiFly.ip());
  setPinMode();
}




void updateInput(){

  boolean change=false;
  for(byte i=0;i<actionInDigLength;i++){
    int readVal=digitalRead((int)(actionInDig[i]-'0'));
    if(i<6){
    if(readVal==0){
      actionInDigStatusClick[i]++;
    }
    else if(readVal==1 && actionInDigStatusClick[i]>=1){
      actionInDigStatusClick[i]=0;
      actionInDigStatus[i]= actionInDigStatus[i]==LOW?HIGH:LOW;
      change=true;
    }}else{
      if((readVal==1 && actionInDigStatus[i]==LOW)||(readVal==0 && actionInDigStatus[i]==HIGH)){
      actionInDigStatus[i]= actionInDigStatus[i]==LOW?HIGH:LOW;
      change=true;
        
      }
      
    }
    
  }
  if(change){
    Client client("192.168.1.205", 3015);
   
    //Serial.println("connecting...");
    
    if (client.connect()) {
      ///Serial.println("connected");
      client.println("GET /  HTTP/1.0");
      client.println("Host: 192.168.1.102");
      client.println("Content-Length:55 ");
      client.println("Connection:cloase ");
      //TODO
      //Compute the content-length dynamic, using char[]
      client.println();

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
         
          client.println();
          client.println();
    } 
    else {
      
      //Serial.println("connection failed");
    }
    while(client.available()) {
      char c = client.read();
    }
   
//    Serial.println("disconnecting.");

    client.stop();
  }
}







void loop() {  
   updateInput();
}






