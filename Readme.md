# Twillio renting apartment

To stay technically proficient and automate my life, I adapted the Twilio example to help me rent my apartment.

## Problem

Most potential renters prefer to contact me by phone in Warsaw, Poland. Though if you put an ad with a phone number, the first dozens of calls are from rental agencies, which charge massive commissions with little value-add.

I also got a very active professional career and can't afford to pick up phones at random times.

## Solution

Provision a temporary Twilio number that will screen participants. It only contacts me during specific hours directly. Otherwise, discourage agencies and message me with details.

It worked well for me. I rented it directly with almost no phone spam and showed it in person a few times.

# How to use it

Adapt code in `functions/`. See [instructions on how to deploy it](readmes/voicemail.md).