import express from "express"
import type { Request, Response } from "express"
import { body, validationResult } from "express-validator"

import * as AuthorService from "./author.service"

export const authorRouter = express.Router()

//GET: list of all authors
authorRouter.get("/", async(request: Request, response: Response) => {
	try {
		const authors = await AuthorService.listAuthors()
		return response.status(200).json(authors)
	} catch(err: any){
		return response.status(500).json(err.message)
	}
})

// GET: single author by id
authorRouter.get("/:id", async (request: Request, response: Response) => {
	const id: number = parseInt(request.params.id, 10);
	try {
		const author = await AuthorService.getAuthor(id)
		if(author){
			return response.status(200).json(author)
		}
		return response.status(404).json("Author could not be found")
	} catch(err: any){
		return response.status(500).json(err.message)
	}
})

authorRouter.post("/", body("firstName").isString(), body("lastName").isString(), async(request: Request, response: Response) => {
	const errors = validationResult(request)
	if(!errors.isEmpty()){
		return response.status(400).json({errors: errors.array()})
	}
	try {
		const author = request.body
		const newAuthor = await AuthorService.createAuthor(author)
		return response.status(201).json(newAuthor)
	} catch(err: any){
		return response.status(500).json(err.message)
	}
})

// PUT: Updating an author

authorRouter.put("/:id", body("firstName").isString(), body("lastName").isString(), async(request: Request, response: Response) => {
	const errors = validationResult(request)
	if(!errors.isEmpty()){
		return response.status(400).json({errors: errors.array()})
	}
	const id: number = parseInt(request.params.id, 10)
	try {
		const author = request.body;
		const updatedAuthor = await AuthorService.updateAuthor(author, id)
		return response.status(200).json(updatedAuthor)
	} catch(err: any){
		return response.status(500).json(err.message)
	}
})

authorRouter.delete("/:id", async(request: Request, response: Response) => {
	const id: number = parseInt(request.params.id, 10)
	try {
		await AuthorService.deleteAuthor(id)
		return response.status(200).json("Author has been successfully deleted")
	} catch(err: any){
		return response.status(500).json(err.message)
	}
})