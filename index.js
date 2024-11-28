const { chromium } = require('playwright')
const fs = require('fs')


async function main(){
	const URL = 'https://www.reddit.com/r/Desahogo/new/'
	const browser = await chromium.launch({
		headless: false
	})
	const context = await browser.newContext()
	const page = await context.newPage()
	await page.goto(URL)
	console.log('Obteniendo datos')
	await page.waitForTimeout(4000)
	await page.waitForSelector('article')
	await page.waitForTimeout(4000)
	const articles = await page.evaluate(()=>{
		let getArticles = document.querySelectorAll('article')
		
		let articles = []
		
		console.log('Lista de articulos')
		console.log(getArticles)

		for(let article of getArticles){
			console.log(article)
			let title = article.querySelectorAll('a')[2].textContent.trim()
			let link = article.querySelectorAll('a')[2].href
			let description = article.querySelectorAll('a')[4].textContent.trim()
			
			articles.push({
				link_post: link,
				title: title,
				description: description
			})
		}

		return articles
	})
	console.log('Datos obtenidos')
	let date = new Date()
	let fileName = `contenido_${date.getDay()}_${date.getMilliseconds()}.json`
   	fs.writeFileSync(`./output/${fileName}`, JSON.stringify(articles))
   	console.log('Escritura completada')

	await context.close()
	await browser.close()

	
} 


main()