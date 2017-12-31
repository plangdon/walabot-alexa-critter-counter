// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

var https = require('https');

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GetLoveScore" === intentName) {
        getInsp(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getHelpResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add Cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Love Predictor. " +
        "Tell me two names and I will tell you the love score.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You can get help by asking, help.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help";
    var speechOutput = "To use the love predictor, say two names, Like Adam and Eve.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Or will Jack and Diane make it work.";
    //    "synonym for little";
    
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for letting share the power of love. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}



function makeTheRequest(n1, n2, theoResponseCallback) {
  var myDate = new Date();
  
  var body = '';
  
  var options = {
      hostname: 'love-calculator.p.mashape.com',
      port: 443,
      path: '/getPercentage?fname=' + n1 + '&sname=' + n2,
      method: 'GET',
       headers: {
        'X-Mashape-Key': 'PO2WabnK0zmshcvogVJAlC4a03HHp1LLuxjjsn7Lp6pQ29ChpH',
        'Accept': 'application/json'
      }
    };
    
    /*

 headers: {
        'X-Mashape-Key': 'PO2WabnK0zmshcvogVJAlC4a03HHp1LLuxjjsn7Lp6pQ29ChpH',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
*/

  https.get(options, (res) => {
    console.log(`Got response: ${res.statusCode}`);
    if (res.statusCode==200) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', () => {
          console.log("RequestBody: " + body);

           theoResponseCallback(null, body);
       
        });
    }
    else {
      console.log(`Got error: ${res.statusCode}`);
      theoResponseCallback(new Error(res.statusCode));
    }
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
     theoResponseCallback(new Error(e.message));
  });
  
  
 
}




function getInsp(intent, session, callback) {
    var repromptText = "You can ask me another.";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var maxLength = 0;
  
var myDate = new Date();

    if (intent.slots.NameTwo.value==='?') {
            speechOutput = "Please only say names.";
             callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }

    makeTheRequest(intent.slots.NameOne.value, intent.slots.NameTwo.value, function theoResponseCallback(err, theoResponseBody) {
        var speechOutput;

        if (err) {
            if (err=='undefiend'){
                 speechOutput += "Sorry, the Love Predictor is stuck with your request, please try again.";
            }
            else {
                speechOutput += "Sorry, the Love Predictor is stuck with your request. Please say just two names like Luke and Laura.";
            }
            
        } else {
            
            var theoResponse = JSON.parse(theoResponseBody);
            
            speechOutput = intent.slots.NameOne.value;
            speechOutput += ' and ';
            speechOutput += intent.slots.NameTwo.value;
            speechOutput += ', they get a score of ' + theoResponse.percentage + '. My Advice, ';
            speechOutput += theoResponse.result;


            
        }

        callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    });
    
}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        /*
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        */
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
