# Daily Prebuilt + Transcription

[Daily Prebuilt](https://daily.co/prebuilt) embedded into a [Next.js](https://nextjs.org/) app with live transcription.


![Live demonstration of transcribing video call audio](example.gif)

## Requirements

To use this demo, you will first need to [create a Daily account](https://dashboard.daily.co/signup) and a [Deepgram account](https://console.deepgram.com/signup). Once you have an account and are logged into the [Daily Dashboard](https://dashboard.daily.co), you can [create a new Daily room](https://dashboard.daily.co/rooms/create) or use our [REST API](https://docs.daily.co/reference/rest-api/rooms).

Transcription is a pay-as-you-go feature on Daily, so ensure you have a  card on file on your Daily account. By default, Daily handles billing for transcription.

If you want to use a Deepgram API key instead (which means billing will be handled via Deepgram instead of Daily), you can set [`enable_transcription` on your Daily domain](https://docs.daily.co/reference/rest-api/your-domain/config#enable_transcription) with your [Deepgram API key](https://console.deepgram.com/) on your domain, like so:

```bash
curl --request POST \
     --url https://api.daily.co/v1/ \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer YOUR_DAILY_API_KEY' \
     --header 'Content-Type: application/json' \
     --data '{"properties": { "enable_transcription": "deepgram:YOUR_DEEPGRAM_API_KEY" }}'
```

## Daily methods and events

This demo uses the following Daily factory methods:

- [`wrap()`](https://docs.daily.co/reference/daily-js/factory-methods/wrap)

This demo uses the following Daily instance methods:

- [`join()`](https://docs.daily.co/reference/daily-js/instance-methods/join)
- [`startTranscription()`](https://docs.daily.co/reference/daily-js/instance-methods/start-transcription)
- [`stopTranscription()`](https://docs.daily.co/reference/daily-js/instance-methods/stop-transcription)

This demo uses the following Daily meeting events:

- [`joined-meeting`](https://docs.daily.co/reference/daily-js/events/meeting-events#joined-meeting)
- [`transcription-started`](https://docs.daily.co/reference/daily-js/events/transcription-events#transcription-started)
- [`transcription-stopped`](https://docs.daily.co/reference/daily-js/events/transcription-events#transcription-stopped)

## Running locally

Install dependencies:

```bash
npm i
```

Run the dev server:

```bash
npm run dev
```

Locally, open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy your own on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/daily-co/clone-flow?repository-url=https%3A%2F%2Fgithub.com%2Fdaily-demos%2Fdaily-prebuilt-transcription.git&project-name=daily-prebuilt-transcription&repo-name=daily-prebuilt-transcription)
