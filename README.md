# WIP!

### How to make a Twitch Application, in order to use its API

- Go to https://dev.twitch.tv/console/apps

#### Create a new application
- Click **[+ Register Your Application](https://dev.twitch.tv/console/apps/create)**
- Input a name for your application (such as "Wheel of Name integration", it doesn't really matter).
- **In OAuth Redirect URLs, you want to set a local https://localhost**, it's where you will be redirected when creating token, you want to keep your token private.
- Category: Application Integration
- Client Type: Confidential (because you are not supposed to share your access).
- **CREATE!!!**

#### Get your (confidential) token
- In the Twitch Developer Applications Console, next to your newly created application click *Manage*, and copy its Client ID.
- Look at this link (DON'T CLICK YET!!!) https://id.twitch.tv/oauth2/authorize?client_id=CLIENTID&redirect_uri=https://localhost&response_type=token&scope=chat:read
- Copy the link to URL bar, and in *CLIENTID* paste your Client Id you got in your Twitch Application.<br>*Should look along the lines of <br>id.twitch.tv/oauth2/authorize?client_id=verylongstringsthatisaclientid&redirect_uri=https://localhost&response_type=token&scope=chat:read*
- Press *Enter*, it *should* redirect you to a Twitch page where you can authorize your application to read your chat (Click Authorize to authorize).
- It should bring you to a broken page. **IT'S NORMAL!** *chill out!*
- You should have get redirected to a URL that looks like the following:<br>localhost/#access_token=superlongstringthatisatokenwow&scope=chat%3Aread&token_type=bearer
- If you look closely, you should see your token that is taking about 1/3rd of the link. Copy it.
- Congrats, you achieved that hardest part.

#### Download & Prepare the page
- Get in *Releases*
- Download the .zip
- Extract it somewhere easy to find
- **Setup info.json**:
- - Token: Put the token you generated above.
- - Username: Set your channel username (with which you made the Twitch Dev Application).
- - Channel: The channel you want to link the wheel to (only the broadcaster can use commands on the wheel).
- *Test the page in your browser to see if it works.*

#### Embed in OBS
- Open OBS
- Create a new **Source -> Browser** *(if you don't have it, most likely missing a plugin. ->Check online<-)*
- Check *Local File*
- Get where you downloaded the release and select **index.html**
- Set a decent **Height** and **Width** (you can reduce its **scale** later on in OBS like a normal source).

### Congrats
You now have a wheel in OBS, linked to your Twitch chat.

### Commands
| Command | Description                | Permissions                  |
|---------|----------------------------|------------------------------|
| !enter  | People enter the wheel     | Any Chatter. One entry only! |
| !spin   | Spin the wheel!            | Broadcaster                  |
| !clear  | Clear the wheel (/entries) | Broadcaster                  |
