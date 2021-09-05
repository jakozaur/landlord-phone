const moment = require('moment-timezone');
const url = require('url');

const GREETINGS_1 = 'Dzień dobry! Dzięki za zainteresowanie mieszkaniem na wynajem.';
const GREETINGS_2_INSIDE = `
Za chwilę połączę Cię z właścicielem.
Jeśli nie jesteś potencjalnym najemcą i dzwonisz w innej sprawie proszę o rozłączenie się.
`;
const GREETINGS_2_OUTSIDE = `
Obecnie nie mogę rozmawiać, ale za chwilę będziesz mógł nagrać swoje pytania czy umówić się na obejrzenie mieszkania.
Odbieram telefony w dni robocze rano od 8 do 9:30 i wieczorem, od 20:30 do 22:00.
W weekend od 8:00 do 22:00
Po sygnale nagraj swoje pytania lub powiedz kiedy pasuję Ci obejrzeć mieszkanie.
`;


const DEFAULT_WORK_WEEK_START = 1; // Monday
const DEFAULT_WORK_WEEK_END = 5; // Friday

function getInteger(stringValue, defaultValue) {
  const parsedNumber = parseInt(stringValue, 10);
  if (isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
}

function shouldRedirectCall(context) {
  const workWeek = {
    start: getInteger(context.WORK_WEEK_START, DEFAULT_WORK_WEEK_START),
    end: getInteger(context.WORK_WEEK_END, DEFAULT_WORK_WEEK_END),
  };

  const currentTime = moment().tz('Europe/Warsaw');
  const hour = currentTime.hour();
  const minute = currentTime.minute();
  const day = currentTime.day();

  // between monday and friday
  const isWorkingDay = day <= workWeek.end && day >= workWeek.start;
  // between 8am and 7pm
  const isWorkingHour = hour <= workHour.end && hour >= workHour.start;

  if (isWorkingDay) {
    const minuteOfDay = hour * 60 + minute;
    return ((8 * 60) <= minuteOfDay && minuteOfDay < (9 * 60 + 30)) ||
      ((20 * 60 + 30) <= minuteOfDay && minuteOfDay < (22 * 60));
  } else {
    return 8 <= hour && hour < 22;
  }

  return isWorkingDay && isWorkingHour;
}

function sayPolish(voiceResponse, text) {
  voiceResponse.say(
    {
      language: 'pl-PL',
      voice: 'Polly.Jacek',
    },
    text
  );
}

exports.handler = function (context, event, callback) {
  const phoneNumberToForwardTo = context.MY_PHONE_NUMBER;

  const twiml = new Twilio.twiml.VoiceResponse();

  sayPolish(twiml, GREETINGS_1);
  if (shouldRedirectCall(context)) {
    sayPolish(twiml, GREETINGS_2_INSIDE);
    const dial = twiml.dial({
      callerId: context.CALLER_ID || event.From,
      callReason: 'Wynajem mieszkania Drawska'
    });
    dial.number(phoneNumberToForwardTo);
  } else {
    sayPolish(twiml, GREETINGS_2_OUTSIDE);
    twiml.record({
      action: url.resolve(context.PATH, 'recording'),
    });
  }
  callback(null, twiml);
};
