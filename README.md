# Wheel of Names Twitch integration (and OBS)

## This project is a work-in-progress!

Big thanks to [MeblIkea](https://github.com/MeblIkea/WheelOfNamesTwitchObsIntegration) for creating the initial working prototype. This would not have been possible without them.

## Getting set up

### Create a Twitch Application

- Go to https://dev.twitch.tv/console/apps/create
- Input a name for your application (such as "Wheel of Names", it doesn't really matter).
- Add `https://localhost` as the only URL in `OAuth Redirect URs`. This is where you will be redirected to after authorizing the application to read your chat. That URL won't be functional, but we don't need it to be. We just need your token to not get stolen.
- Set `Category` to `Application Integration`.
- Set `Client Type` to `Confidential` (because you are not supposed to share your access token).
- Click `Create`!

### Get your (confidential) access token
- Click `Manage` on your newly created Twitch application, and copy its Client ID.
- Use this link in the next step: `https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=https://localhost&response_type=token&scope=user:read:chat+user:bot`.
- Copy the link to URL bar, and replace `CLIENT_ID` with the client ID of your Twitch Application.
- Press *Enter*, it *should* redirect you to a Twitch page where you can authorize your application to read your chat (Click Authorize to authorize).
- It should send you to a broken page. **That's expected!** *Don't worry!*
- You should have been redirected to a URL that looks like the following: `https://localhost/#access_token=superlongstringthatisatokenwow&scope=user%3Aread%3Achat+user%3Abot&token_type=bearer`
- If you look closely, you should see your token that is taking about a quarter of the link. Copy it.
- Congrats, you've achieved that hardest part.

### Download & Prepare the page
- Go to this repository's [*Releases*](https://github.com/gomander/wheel-of-names-twitch-integration/releases)
- Download the `.zip` file.
- Extract it somewhere easy to find.
- Enter your information into the top of `app.js`:
  - Set the access token you generated above as the value for `ACCESS_TOKEN`.
  - Set your application's client ID as the value for `CLIENT_ID`.
  - Set your Twitch username as the value for `BROADCASTER`.
- *Test the page in your browser to see if it works.*
- **IMPORTANT**: Do not show your access token to anyone! Do not commit it to a public repository!

### Embed in OBS
- Open OBS: Studio (this probably works for other similar software).
- Create a new **Source -> Browser**.
- Check *Local File*.
- Get where you downloaded the release and select **index.html**.
- Set width and height to 700 (you can change the **scale** later on in OBS like a normal source).

## Congratulations!
You now have a wheel in OBS, linked to your Twitch chat.

### Commands
| Command       | Description                      | Permissions                  |
|---------------|----------------------------------|------------------------------|
| !enter        | People enter the wheel           | Any Chatter. One entry only! |
| !spin         | Spin the wheel!                  | Broadcaster                  |
| !removewinner | Remove the winner from the wheel | Broadcaster                  |
| !clear        | Clear the wheel (/entries)       | Broadcaster                  |

### Customization

If you want to change any of the wheel parameters, see [this question in the Wheel of Names FAQ](https://wheelofnames.com/faq#sharing-4). Simply edit the URL in the `<iframe>` element's `src` attribute following the examples listed in the FAQ.

Things you can change:
- wheel colors
- winner dialog message
- don't show the winner dialog
- page background color

To change the prefix the wheel uses (say you want to use `~spin`), or to change the name of any of the commands (like `!clear` to `!clearwheel`), those can easily be modified near the top of `app.js`.

If you want to create a custom effect for the winner instead of using the winner dialog, you can do so in the `message` event listener that currently prints the `spinResult`.
