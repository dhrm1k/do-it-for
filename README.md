# do it for

so i made this browser extension bc i kept getting distracted by stupid websites when i was supposed to be working. you know how it is - you open facebook "just for a minute" and suddenly it's 3 hours later and you've done nothing.

the idea is simple. you upload a photo of someone you care about - could be your mom, your partner, your dog, whoever motivates you. then you pick their pronoun. when you try to visit sites you've blocked, instead of the usual "this site is blocked" message, you see their face and it says "do it for them" (or him/her).

sounds cheesy? yeah probably. does it work? idk, try it and let me know.

## what it does

- lets you upload a motivational photo (your person/pet/whatever)
- select pronouns (her/him/them)
- block websites that waste your time
- shows your photo + "do it for [pronoun]" when you try to visit blocked sites
- gives you option to go back or allow once (bc sometimes you actually need to check that instagram dm)

## how to install

1. download/clone this repo
2. open chrome and go to `chrome://extensions/` or open edge and go to edge://extensions.
3. turn on "developer mode" (top right toggle)
4. click "load unpacked" and select the folder
5. done. you'll see the extension icon in your toolbar

for firefox:
1. go to `about:debugging`
2. click "this firefox"
3. click "load temporary add-on"
4. select the `manifest.json` file

## setup

click the extension icon, hit the gear button, and:
- pick a pronoun 
- upload a photo of your motivation
- add websites you want to block (just type "facebook.com" or whatever)
- hit save

## files structure

```
do-it-for/
├── manifest.json          # extension config
├── popup.html            # main popup ui
├── popup.css             # styling (clean, not ai-ish purple gradients)
├── popup.js              # popup functionality
├── block.html            # the page you see when site is blocked
├── block.css             # block page styling
├── block.js              # block page logic
├── background.js         # handles the actual blocking
└── rules.json            # required by chrome's blocking api
```

## why i made this

got tired of blocking extensions that just show boring "access denied" pages. if you're gonna block yourself from wasting time, might as well make it meaningful. seeing someone you care about asking you to stay focused hits different than a generic error page.

also all the existing website blockers looked like they were designed by enterprise software companies in 2010. wanted something that doesn't look like ass.

## tech stuff

uses chrome's `declarativeNetRequest` api for blocking (more efficient than the old webRequest stuff). stores your photo and settings locally using chrome.storage. no data goes anywhere, it's all on your machine.

works in chrome, edge, and other chromium browsers. firefox support is there but haven't tested it much.

## contributing

if you want to add features or fix bugs, just make a pr. keep the code simple and don't make it look like ai wrote it.

some ideas for features:
- timer before allowing access
- different messages for different sites
- stats on how much time you saved
- sync settings across devices
- mobile app maybe?

## license

mit license. do whatever you want with it. if it helps you focus, that's cool. if you make money off it, buy me a coffee or something.

---

