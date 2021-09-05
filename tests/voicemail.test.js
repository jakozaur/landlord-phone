const { Settings, DateTime } = require("luxon");
let mockedTimeString = '2020-09-05T10:30:00.000Z';
Settings.now = () => new Date(mockedTimeString).valueOf();

const helpers = require('./test-helper');
const voicemailFunction = require('../functions/voicemail').handler;
const Twilio = require('twilio');

let context = {};
let event = {};

beforeAll(() => {
  helpers.setup(context);
});

afterEach(() => {
  context = {};
  event = {};
});

afterAll(() => {
  helpers.teardown();
});

test('returns a VoiceResponse', (done) => {
  const callback = (_err, result) => {
    expect(result).toBeInstanceOf(Twilio.twiml.VoiceResponse);
    done();
  };

  voicemailFunction(context, event, callback);
});

test('forwards calls during weekend', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Dial><Number>\+12223334444<\/Number><\/Dial><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});

test('forwards calls during morning workday', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  mockedTimeString = '2020-09-05T06:30:00.000Z';

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Dial><Number>\+12223334444<\/Number><\/Dial><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});

test('forwards calls during evening workday', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  mockedTimeString = '2020-09-05T18:31:00.000Z';

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Dial><Number>\+12223334444<\/Number><\/Dial><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});

test('sends default message after hours weekend', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  mockedTimeString = '2020-09-05T21:01:00.000Z';

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Record action="\/demo\/recording"\/><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});

test('sends default message before hours weekend', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  mockedTimeString = '2020-09-05T05:59:00.000Z';

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Record action="\/demo\/recording"\/><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});


test('sends default message outside of business hours', (done) => {
  context = {
    PATH: '/demo/voicemail',
    MY_PHONE_NUMBER: '+12223334444',
  };

  mockedTimeString = '2020-02-13T19:00:00.000Z';

  const callback = (_err, result) => {
    expect(result.toString()).toMatch(
      /.*<Record action="\/demo\/recording"\/><\/Response>$/
    );
    done();
  };

  voicemailFunction(context, event, callback);
});
