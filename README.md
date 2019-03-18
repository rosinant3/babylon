# Babylon

Playlist maker and playlist player (for YouTube videos) that compliments educational content. 
Small article reader with library to store longform news articles and take notes or add additional information. 

Made with Node.js/Express.js and React.js/Redux.js. MySQL database.

Features:

General:
   - user registration and login with appropriate validation
   - public/private playlists/articles with forms to search for all of the possible combinations
   - pagination of every get request
   - minimizing the amount of ajax calls, utilizing the redux store to save already made requests, preventing useless calls to be made for data that's already there
   - playing around with the YouTube API
   - improving my familiarity with node.js/express.js
   - improving my mySQL skills
   - had a lot of fun during the process

Playlists:
  - creating playlists (adding, removing, drag and drop moving of videos, adding the playlist to the database),
  - searching for youtube videos, playlists and channels, with the option to open all of the videos of a certain playlist/channel,
  - editor with similar features,
  - playlist player, tracking the duration of watched videos, autoplay of next video after the video ends, the player starts with the last watched video, pagination of the player playlist is set to 12, if all of the first 12 videos are watched, a recursive call is made until a video that is not watched is found
  - comment section under videos for taking notes, with the ability to remove and edit the notes
  
Articles:
  - similar functionality and features (like the playlist maker)


![Babylon](https://i.imgur.com/hFp03Nb.png)

Quick rundown is shown in the video below:


[Babylon Presentation](https://youtu.be/_T07_RPgyNc "BABYLON PRESENTATION")

[![Babylon](https://i.ytimg.com/vi/_T07_RPgyNc/hqdefault.jpg)](https://youtu.be/_T07_RPgyNc "BABYLON PRESENTATION")

Pictures:

1.

![Babylon](https://i.imgur.com/CiEkP3A.png)

2.

![Babylon](https://i.imgur.com/LZoD9jR.png)

3.

![Babylon](https://i.imgur.com/4zyuz3q.png) 

4.

![Babylon](https://i.imgur.com/LdRSG8G.png) 

5.

![Babylon](https://i.imgur.com/d2a3rQM.png) 

6.

![Babylon](https://i.imgur.com/QeozEQv.png) 

7.

![Babylon](https://i.imgur.com/sTZzD90.png)










