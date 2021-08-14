# Helium-Flick


Helium-Flick is a desktop application for Helium hotspot owners, in the shape of a small taskbar tool, which allows you to follow the status, activity and earnings for the devices of your list. The purpose of this application is to keep track of all your hotspots, directly at the corner of your screen.

### Latest version

[Download here](https://github.com/justinevedovato/Helium-Flick/releases)

## How to use

Once your app is started, go to the Settings page.
You have two options:

- Add hotspot address

Add manually your hotspot's ID (For example, if your hotspot is called magnificent-sparkly-blob, then this is **NOT** the name you want. You will need its address, which is a string of digits and letters. And if you don't know where to find it, you will find it on the [Helium Explorer website](https://explorer.helium.com/), by typing the readable name in the search bar.

- Add from user ID

This is more convenient for you if you have several hotspots under the same owner account. Simply paste your Owner ID in the field and it will fetch all your hotspots for you.


Once you added your hotspots, you can go back to the Home page, where you will see them appear, showing their readable names, status, location and balance (Daily and total).

You can click on one of them to open its dedicated page, and see more infos, including the activity feed. You can deploy some of the activities to see more details.
Note: It may be very slow to open the page, due to the Helium servers being overloaded at times, simply wait and try again later, there is nothing you can do except wait until the API relies properly.

This is it! I hope this little app makes your Helium mining life easier!

## About the app

This is an Electron application, using Vite and Vue 3.
It relies on Local Storage to store a list of the hotspots addresses, and uses them to get their infos from the public Helium API.

All of the data that is used is completely public and accessible from the [Helium Explorer website](https://explorer.helium.com/) itself.
You might not want to load their Explorer everytime you want to check how your hotspots are doing, so this app is a tool to make it more compact and makes sure to only get relevant data about your hotspot(s) only.


## Development


Feel free to clone the repository if you find any interest of running this application locally.

Once you clone it, make sure to install all the dependencies from the root folder: `npm i`

Then, to run the development version: `npm run electron:dev`, this is gonna run Vue and Electron at the same time.

Once you're done, you can build: `npm run app:build` (Works for Windows so far)

You will find your .exe file under the `dist_electron` folder.

And you're done!
