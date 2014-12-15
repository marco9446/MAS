#include <IRremote.h>
#include <IRremoteInt.h>

//This code send a message from the arduino to the server when something appen
//The respost of the server is not keep 

#include "WiFly.h"

#define actionInDigLength 7
#define actionInAnalogLength 3
#define DEBUG true
#define ID "1111111112"
#define Type "INPUT "
#define PIN "2=b,3=b,4=b,5=b,6=s,7=s,8=w,9=t,A=t,B=t,C=t,D=t,E=t,F=t,G=t,H=t,I=t"
IRrecv irrecv(9);
decode_results results;
char actionInDig[]={
  '2','3','4','5','6','7','8'};

char actionInDigStatus[]={
  LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW,LOW
};


byte actionInDigStatusClick[]={
  0,0,0,0,0,0,0,0
};




void setPinMode(){
  for(byte i=0;i<actionInDigLength;i++){
    pinMode((int)(actionInDig[i]-'0'),INPUT_PULLUP); 
  }
  pinMode(9,INPUT);
}

void onlyOneTimePleas(){
  Client client("10.20.6.141", 3005);
  if (client.connect()) {
    client.println("GET /  HTTP/1.0");
    client.println("Host: 192.168.1.102");
    client.println("Content-Length:106");
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
}

void setup() {
  Serial.begin(9600);
  WiFly.begin();
  if (!WiFly.join("ModularAutomationSystem", "fbedulli4")) {
    while (1) {
    }
  }
  onlyOneTimePleas();
  setPinMode();
  irrecv.enableIRIn(); 
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
      }
    }
    else{
      if((readVal==1 && actionInDigStatus[i]==LOW)||(readVal==0 && actionInDigStatus[i]==HIGH)){
        actionInDigStatus[i]= actionInDigStatus[i]==LOW?HIGH:LOW;
        change=true;

      }

    }
  }

  String pippo="       ";
  boolean b1=false;
  if (irrecv.decode(&results)) {
    Serial.println(results.value,HEX);
    switch(results.value)
    {
    case 0xFF6897:  
      b1=true;  
      Serial.println("p9");
      actionInDigStatus[8]=actionInDigStatus[8]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[8]==HIGH?",{p9:t}":",{p9:f}";
      break;

    case 0xFF30CF:  
      b1=true;        
      Serial.println("pA");
      actionInDigStatus[9]=actionInDigStatus[9]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[9]==HIGH?",{pA:t}":",{pA:f}";
      break;

    case 0xFF18E7: 
      b1=true; 
      actionInDigStatus[10]=actionInDigStatus[10]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[10]==HIGH?",{pB:t}":",{pB:f}";
      break;

    case 0xFF7A85:  
      b1=true;
      actionInDigStatus[11]=actionInDigStatus[11]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[11]==HIGH?",{pC:t}":",{pC:f}";
      break;

    case 0xFF10EF: 
      b1=true; 
      actionInDigStatus[12]=actionInDigStatus[12]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[12]==HIGH?",{pD:t}":",{pD:f}";
      break;

    case 0xFF38C7:  
      b1=true;
      actionInDigStatus[13]=actionInDigStatus[13]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[13]==HIGH?",{pE:t}":",{pE:f}";
      break;

    case 0xFF5AA5:
      b1=true;  
      actionInDigStatus[14]=actionInDigStatus[14]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[14]==HIGH?",{pF:t}":",{pF:f}";
      break;

    case 0xFF42BD:  
      b1=true;
      actionInDigStatus[15]=actionInDigStatus[15]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[15]==HIGH?",{pG:t}":",{pG:f}";
      break;

    case 0xFF4AB5: 
      b1=true; 
      actionInDigStatus[16]=actionInDigStatus[16]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[16]==HIGH?",{pH:t}":",{pH:f}";
      break;

    case 0xFF52AD:
      b1=true;  
      actionInDigStatus[17]=actionInDigStatus[17]==HIGH?LOW:HIGH;
      pippo = actionInDigStatus[17]==HIGH?",{pI:t}":",{pI:f}";
      break;

    default: 
      Serial.println(" other button   ");


    }
    irrecv.resume(); // Receive the next value
    delay(200);
  }

  if(change || b1){
    Client client("10.20.6.141", 3015);
    if (client.connect()) {
      client.println("GET /  HTTP/1.0");
      client.println("Host: 192.168.1.102");
      client.println("Content-Length:55 ");
      client.println("Connection:close");
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
      client.print(pippo);
      client.println();
      client.println();
      while(client.available()) {
        char c = client.read();
      }
      client.stop();
    } 
  }
}







void loop() {  
  updateInput();
}









