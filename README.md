# Babylon

If you want to run this on your machine, adjust the information in the knexfile.js, run knex migrate:latest, run npm run dev.

Playlist maker and playlist player (for YouTube videos) that compliments educational content. 
Small article reader with library to store longform news articles and take notes or add additional information. 

**General**:
   - React.js with Redux.js;
   - Node.js/Express.js;
   - MySQL with Knex.js;
   - User registration and login with appropriate validation;
   - Public/private playlists/articles with forms to search for all of the possible combinations;
   - Pagination for every get request;

   
**Playlists**:
  - Creating playlists,
  - Removing playlist,
  - Drag and drop moving of videos that utilizes Redux to save the information of the current video being dragged because, usually, JavaScript does not allow it natively (might be highly illigal, but I learned a lot by expirementing with it),
  - Editor that looks like a copy/paste version of the initial creator, BUT it modifies the database, which required additional tweeking of the code, plus additional back-end code, obviously
  - Searching for youtube videos, playlists and channels, with the option to open all of the videos of a certain playlist/channel;
  - Playlist player
  - Tracking the duration of watched videos
  - Autoplay of next video after the video ends
  - The player starts with the last watched video, pagination of the player playlist is set to 12, if all of the first 12 videos are watched, a recursive call is made until a video that is not watched is found;
  - Comment section under videos for taking notes, with the ability to remove and edit the notes;
  
**Articles**:
  - Similar ideas


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










