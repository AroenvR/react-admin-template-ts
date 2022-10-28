# Simple React Admin App template using TypeScript.

Welcome.  
This is a simplistic template for a quick React App using TypeScript.  
Both TypeScript and ESLint are configured quite loosely, so they still need some work.

Testing library used is Jest, which has also been loosely configured to enable the use of localStorage and sessionStorage.

This template makes use of the React Admin library: https://marmelab.com/react-admin/
React Admin, in turn, makes use of the MUI library: https://mui.com/

### To get started:
```  
npm i  

npm start  
```

### To deploy to a Github Page:
```
Adjust package.json to include homepage url  
"homepage": "https://aroenvr.github.io/react-template-ts/", <-- name should match repository name (case sensitive)  

Create a gh-pages branch in your repository.  
Go to repository settings -> pages ->  
    set source to gh-pages branch and /root  

After pushing new code, execute 'npm run deploy' to update the gh-pages branch.
```
