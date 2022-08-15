# travel-journal
Guide for travelers around the world. 

# Problem Statement (Owner: Product)
# Scope:
Travel is unpredictable. While millions ol travelers everyday can't forsee the future, our travel application helps every type of traveler find an unforgettable experience of their own, curated by fellow users. 

# Impact: 
Your travel expectations can differ from reality. Always find your true experience before you make the trip. 

# Causes: 
Want to find the most popular stops where you're going? Trying to avoid crowded peak times when travelling? Great service? Or maybe you want to find local secrets and hidden gems. Follow experienced travellers and their advice where ever you're going. 

# Other solutions: 
Other travel sites such as Expedia and KAYAK provides travel booking. Review sites such as Yelp and Tripadvisor offers community driven reviews and forums for travel. Our application provides a more positive and personal approach to community travel sharing by offering users the ability to share, comment, and review each other's trips. 

# Design a Solution (Owner: Database & Frontend)
![travel-journal.png](travel-journal.png)

## Overview of travel-journal website that will be built
This project is to build a blog website for travelers. It is a collection of the interesting and useful information of all favorite places where travelers have unforgettable experiences when they visited there.
Each post of any traveler will be review, comment and rating by users who are interested in the post.
More valuable posts with positive comments and rating from every user in the world are more valuable data for this website.
## Description of the Databases, Collections, Schema, Source of data
  Database name: travel-journal (in MongoDB Atlas);
  Collections: users, posts, comments
  Collection Schemas:
  1/ users {
      userid (_id): string,
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      image: string,
      createdAt: timeStamp,
      updatedAt: timeStamp
    };
  2/ posts {
      postid (_id): string,
      title (title of the post): string,
      city: string,
      country: string,
      image: string,
      content (unforgettable memories): string,
      roundtripPrice {
        airBnBPrice: number,
        hotelPrice: number,
        couplePrice: number,
        familyPrice: number
      }
      userid: string,
      createdAt: timeStamp,
      updatedAt: timeStamp
    };
  3/ myFavoritePosts {
      postId (_id): string,
      userId: string,
      createdAt: timeStamp
    };

  4/ comments {
      commentid (_id): string,
      name: string,
      email: string,
      postid: string,
      text: string,
      rating (from 1 to 5 stars): number,
      date: timeStamp
    };


## List of endpoints
  registerUser;
  updateUser;
  loginUser;
  getUserById;
  getAllPosts;
  getPostsByUserId;
  getPostByPostId;
  createPost;
  updatePost;
  deletePost;
  createComment;
  getCommentsByPostId;
  getAvgRateForPost;


## External tools (not libraries like React, but separate systems or third party tools, like a second database)
For Front-End: redux-toolkit, jwt-decode, bootstrap, react-google-login, react-paginate, react-icons, axios,...

For Back-End: mongoose, express, express-async-handler, bcryptjs, dotenv, jsonwebtoken, nodemon, concurrently, multer, body-parse, cors,...

## Describe the functionality that the front end app will have
Home page: display all posts with comments and rating for each post and searching feature
Login page;
Register page;
Update user page;
My Posts: display all posts of loggedin user;
My Favorite Posts: display all the user's favorite posts


# Plan a work timeline (Owner: Project Manager)
## High level work timeline. List the work items that you plan to complete, organized by each of the 5 remaining weeks until the presentation

![img.png](assets/img.png)






