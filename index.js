const axios = require("axios");

const API_URL = "https://hight-ais.ngrok.io/jderest/v3/orchestrator/HIGHT_DEMOGetSupplier1";


exports.handler = async (event) => {
  console.log("request: ", event)
  try{
    return await getInfo(event)   
  } catch (err) {
    console.error(err)
  } 
};

async function getInfo(e) {
  const intentName = e.sessionState.intent.name
  try {
    if (intentName === "GetInfoType") {
      const infoType = e.sessionState.intent.slots.InfoType.value.interpretedValue
      const alphaName = e.sessionState.intent.slots.AlphaName.value.interpretedValue
      let infoTypeValue = ""
      if (infoType.toLowerCase() === "supplier") {
        infoTypeValue = "V"
      } else if (infoType.toLowerCase() === "customer") {
        infoTypeValue = "C"
      } else if (infoType.toLowerCase() === "employee") {
        infoTypeValue = "E"
      }
      const auth = {
        auth: {
          username: 'JDE',
          password: 'JDE'
        }
      }
      const body = {
        "inputs": [
          {
              "name": "nameSupplier",
              "value": alphaName
          },
          {
              "name": "typeAB",
              "value": infoTypeValue
          }
        ]
      }
      const resp = await axios.post(API_URL, body, auth)
      const taxID = resp.data['Tax ID']
      const city = resp.data.City
      const postalCode = resp.data['Postal Code']
      const address = resp.data['Address Line 1'] + " " + resp.data['Address Line 2']
      return{
        "sessionState": {
          "dialogAction": {
            "type": "Close"
          },
          "intent": {
            "name": "GetInfoType",
            "state": "Fulfilled"
          }
        },
        "messages": [
          {
          "contentType": "PlainText",
          "content": `Here is the reply about ${alphaName}:`
          },
          {
            "contentType": "ImageResponseCard",
            "imageResponseCard": {
             "title": `${alphaName}`,
             "subtitle":`
             Tex ID: ${taxID},
             City: ${city}, 
             Postal Code: ${postalCode}, 
             Adress: ${address}
             `,
            }
           }
         ]
      }
    } 
  }catch (err) {
    console.log(err)
  }
    
}


