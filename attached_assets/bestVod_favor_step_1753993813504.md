


## Project Overview
- **Objective**: Build a web-based Video Streamg List App to 
- **Tech Stack**:
  - **App Name**: MyVideo
  - **Frontend**: React with Vite,  CSS 
  - **Backend**: Node.js, Express.js
  - **Database**: PostgressSql
 
- **Key Features**:
  - provide language interalizaton English/Spanish/Korean
  -  dashboard for top 10 videos by types
  - Responsive UI
- video link will be pullup by youtube with pre defined video type
  - video type will have 3 types : 'music', 'sermon', 'other' and each type will have allow multple key word.
  

# database table for group
- create table for group
- create groupName, groupType, groupValue, 
- inital data will be 
  Category, ct1, 1
  Category, ct2, 2
  Category, ct3, 3
  Type, tp1, 1
  Type, tp2, 2
  Type, tp3, 3

# database table for favorVideo
- create table for favorVideo
- create field title, youTubeLink, description, category, type
- category,type will value is comming from group table.
- all other field will be less than 100 Characters, description 200 Characters 


# groupAdminPage
- create page for CRUD for group

# favorAdminPage
- create page for CRUD for favorVideo
- category, type should be dropdow box. 



# Main AdminPage
- add menu for this admin page
- this page will provide navigation favorAdminPage, groupAdminPage with tab


# favorPage
- add menu for this admin page
- display video from favorVideo table

