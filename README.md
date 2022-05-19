## Installation Guide
In the project directory, you can run `npm start` after installing dependencies with `npm install`:

It runs the backend server, Open [http://localhost](http://localhost) to verify it.


### Photoshop configuration
- The script access photoshop by running commands like ```photoshop some_script.jsx``` so photoshop needs to be in environment variable.

![image](https://user-images.githubusercontent.com/52674815/169369795-9bd517d6-a9d0-47e7-a0de-643a394a06bd.png)

- Add/Edit ```PSUserConfig.txt``` 

  Photoshop shows warning while running such script which halts the execution. To prevent this, add a txt file named ```PSUserConfig.txt```.
  - Directory ```C:\Users\admin\AppData\Roaming\Adobe\Adobe Photoshop 2021\Adobe Photoshop 2021 Settings``` (It won't be exact for you but you get it, right?)
  - Add this line to the txt file created: ```WarnRunningScripts 0```

## Need Help?
Feel free to ping me at shubhamp.developer@gmail.com
