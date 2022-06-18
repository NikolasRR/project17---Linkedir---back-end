import postsRepository from "../repositories/postRepository.js"
import urlMetadata from "url-metadata"
import findHashtags from "find-hashtags";

export async function postPublication(req, res) {
    try {
        const { id } = res.locals.user
        const { text, url } = res.locals

        const hashtags = findHashtags(text);

        const { rows } = await postsRepository.verifyUser(id);
        if (rows.length === 0) {
            return res.status(401).send("Você não tem cadastro")
        }

        const { title, description, image } = await urlMetadata(url)

        const metadatas = {
            title,
            description,
            image
        };

        console.log(metadatas)

        const { rows: result } = await postsRepository.postLink(title, description, image, url)
        const linkId = result[0].id

        const { rows: data } = await postsRepository.postPublication(id, text, url, linkId);
        const postId = data[0].id;

        res.sendStatus(200)

    } catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
}

export async function getPublications(req, res) {

    try{
        const {rows} = await postsRepository.getPublications();

        res.status(200).send(rows)

    } catch (e) {
        console.error(e)
        res.sendStatus(500)
    }
}

export async function deletePost(req, res) {
    const { linkId } = req.query;

    try {
        await postsRepository.deletePost(linkId);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}