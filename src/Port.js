import axios from 'axios'
import nlp from 'compromise'

class Port {
	constructor(apiKey = "", ens = "0x"){
		// credentials
		this.apiKey = apiKey
		this.querent = ens
	}

	// protec
	async getCloud() {
		// e.g.
		const chargedCloudSet = []
		// get charged particle implementation

		// API loop on nft list calls
		let image = 'https://www.trustedtarot.com/img/cards/the-magician.png'

		let res

		const options = {
		  method: 'POST',
		  url: 'https://api.nftport.xyz/visual_search_by_url',
		  headers: {'Content-Type': 'application/json', Authorization: ''},
		  data: {
		    url: image
		  }
		};

		try{
			res = await axios.request(options)
		}catch(e){
			console.log(e)
		}

		if(res){
			console.log('nlp')
			console.log(nlp('the quick brown fox'))
			res.data.images.map((cp) => {
				// make call on raw_metadata
				// loop through text
				nlp(cp.raw_metadata.description).topics().json().map((term) => {
					chargedCloudSet.push(term.text)
				})
			})
		}
		return chargedCloudSet
	}

	// attac
	async inspect(url){
		let image = 'https://www.trustedtarot.com/img/cards/the-magician.png'
		let res

		const options = {
		  method: 'POST',
		  url: 'https://api.nftport.xyz/v0/recommendations/similar_nfts/urls',
		  headers: {'Content-Type': 'application/json', Authorization: this.apiKey},
		  data: {
		    url: image,
		    page_number: 1,
  			page_size: 50
		  }
		};

		try{
			res = await axios.request(options)
		}catch(e){
			console.log(e)
		}

		try{
			res = await axios.request(options)
		}catch(e){
			console.log(e)
		}

		if(res){
			console.log(res)
		}
	}
}

export default Port;
