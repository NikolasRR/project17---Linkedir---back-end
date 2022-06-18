import db from "../config/db.js";

async function verifyUser(id){
    return db.query(`SELECT * FROM users where id=$1`,[id])
}

async function postLink(title,description,image,link){
    return await db.query(`
    INSERT INTO links (title,description,image,link) VALUES ($1,$2,$3,$4) RETURNING id`,[title,description,image,link])
}

async function postPublication(id,text,url,linkId){
    return await db.query(`
    INSERT INTO publications ("idUser",content,url,"linkId") VALUES ($1,$2,$3,$4) RETURNING id`,[id,text,url,linkId])
}

async function getPublications(){
    return await db.query(`SELECT publications.content, publications.url, COUNT(likes."publicationId") as "totalLikes", users.id as "userId", users."userName", users.image as profile, links.* 
    FROM publications
    LEFT JOIN likes
    ON publications.id = likes."publicationId"
    JOIN users 
    ON publications."idUser" = users.id
    JOIN links
    ON links.id = publications."linkId"
    GROUP BY publications.id,users."userName", users.image,likes."publicationId",links.id,users.id
    ORDER BY publications."createdAt" DESC LIMIT 20
    `)
}

const postsRepository = {
    verifyUser,
    postLink,
    postPublication,
    getPublications    
}

export default postsRepository;