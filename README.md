# walabot-alexa-critter-counter
Using a Walabot and Alexa to notify and quantify critter activity in your wall.

Walabot + Alexa : Critter Counter / Notification System
Before you jump to conclusions on my feelings about critters and their place in the world, suspend those thoughts consider my project as a kind of census for those that may be dwelling in your walls.

Background:
I live in a fairly old (120 year old) house in New England that abuts a conservation area. As the days get shorter and the digits drop on the mercury, I am joined in my old home by a group of furry friends. 

mouse.jpg

Winter Squatter 
Solving any problem involves understanding the problem. This project is an exploration in the better understanding of my problem.
Step 1: Data Collection
We will perform a type of census to understand the activity location and frequency of our furry friends. 
Logging the data can help us measure if this is a growing problem.
Step 2: Notifications
Push messages to email, SMS and Echo device when activity is occurring.
Step 3: Test Effectiveness of Corrective Measures
We tried some methods such as Peppermint Oil to try to keep our friends away from some of our favorite areas. Using the monitoring system to evaluate if the Peppermint Oil spray keeps the mice at bay. 
The Build Components:
walabot-internal.png
Walabot
What is Walabot?
A programmable sensor that will turn your PC/SBC into a 3D imaging system. It has a highly flexible sensor system with between 3 and 18 antennas, wideband frequency operation and on board preprocessing with USB 3.0/2.0 data interface.
Walabot has a broad range of capabilities, so you can develop an array of applications including target tracking, 3D imaging through solid objects, breath detection, doppler measurements for speed, and more. 
There are a lot more specifics about the Walabot board here:
https://walabot.com/docs/walabot-tech-brief-416.pdf  
This 3D imaging sensor will allow us to view into our 120 year old plaster walls to detect movement.
Pi2ModB1GB_-comp.jpeg
Raspberry Pi
Raspberry Pi
A powerful Single Board Computer (SBC) that runs a Linux OS that allows connectivity with sensors and cloud services via USB and WiFi interfaces.
echo.jpg
Amazon Echo
Amazon Echo
One of the many voice hardware interfaces to Amazon's Alexa Voice services. Allows humans to interface many connected services and sensors. Amazon's powerful Speech to Text, Natural Language Processing and easy integration with AWS growing library of services allows for quick development of connected solutions. 
AWS (Amazon Web Services)
We leverage several AWS services to build our solutions.
AWS IoT - Internet of Things (IoT) suite of services including a message service (MQTT), a rules processing engine and a data store (Shadow State).
Lambda - A serverless functional unit computing for executing computer programs without physical servers.
SNS - Amazon's suite of messaging services such as email and SMS.
Alexa Skill Kit - The software component used customized to run your voice interactions. 
How Does It Work:
Mode 1: Notification/Data Collection (See Diagram Below)
The Walabot is connect to a Raspberry Pi and calibrated to section of the wall you wish to measure for activity.
Every time a creature enters the area of the wall being measure the Walabot detects the movement in the wall and publishes a message to AWS IoT MQTT Topic. The AWS IoT Rules engine receives the incoming message and increments the counter in the Shadow State in AWS IoT. The Rules engine also triggers an AWS SNS event that sends off an email and SMS to the configured recipients. Lastly the IoT Rules engine triggers a Lambda function to cause a Notification event to be sent to my Amazon Echo to prompt me to invoke the Critter Counter Voice Skill.
Notification Flow.png
Notification Flow
Mode 2: Voice Skill Invocation (See Diagram Below)
The activity captured by the Walabot and recorded to the AWS IoT Shadow State is accessible via the Alexa "Critter Counter" Voice Skill (ID: amzn1.ask.skill.514a4239-a33a-4f38-ad06-e1249a409d64 - pending approval).
Upon invoking the skill the Lambda function will query the AWS IoT Shadow state and return the count of "critter" activity within the specified timeframe of your query. 
