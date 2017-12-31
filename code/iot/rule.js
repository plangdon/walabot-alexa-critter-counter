console.log('Loading function');
    // Load the AWS SDK
    var AWS = require("aws-sdk");
    
    // Set up the code to call when the Lambda function is invoked
    exports.handler = (event, context, callback) => {
        // Load the message passed into the Lambda function into a JSON object 
        var eventText = JSON.stringify(event, null, 2);
        
        // Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
        console.log("Received event:", eventText);
        
        // Create a string extracting the click type and serial number from the message sent by the AWS IoT button
        var messageText = "Received  " + event.clickType + " message from button ID: " + event.serialNumber;
        
        // Write the string to the console
        console.log("Message to send: " + messageText);
        
        // Create an SNS object
        var sns = new AWS.SNS();
        
        // Populate the parameters for the publish operation
        // - Message : the text of the message to send
        // - TopicArn : the ARN of the Amazon SNS topic to which you want to publish 
        var params = {
            Message: messageText,
            TopicArn: "arn:aws:sns:us-east-1:123456789012:MyIoTButtonSNSTopic"
         };
         sns.publish(params, context.done);
    };
