import axios from 'axios';

//https://api-apollo.pegaxy.io/v1/game-api/market/pegaslisting/1?sortBy=price&sortType=ASC&isAuction=false&page=1

//https://api-apollo.pegaxy.io/v1/pegas/339437

const minScore = 34;

interface Pegi {
    speed: number;
    strength: number;
    wind: number;
    fire: number;
    water: number;
    lightning: number;
}

const findScore = (pegi: Pegi): number => {
    return pegi.speed + pegi.strength + pegi.wind + pegi.fire + pegi.water + pegi.lightning;
}

const findBest = async () => {
    let page = 1;
    const found = [];

    while (page < 10) {
        const marketUrl = `https://api-apollo.pegaxy.io/v1/game-api/market/pegaslisting/${page}?sortBy=price&sortType=ASC&isAuction=false`;
        console.log(marketUrl);
        const marketResponse = await axios.get(marketUrl);
        
        for (const marketListing of marketResponse.data.market) {
            const marketId = marketListing.pega.id;
            const price = marketListing.price / 1000000;
            const pegiUrl = `https://api-apollo.pegaxy.io/v1/pegas/${marketId}`;
            const pegiResponse = await axios.get(pegiUrl);
            const score = findScore(pegiResponse.data);
    
            if (score >= minScore) {
                console.log(marketId, `$${price}`, score);
                found.push(pegiUrl);
            } else {
                //console.log(marketId, `Score too low: ${score}.`);
            }
        }

        page++;
    }

    console.log(found);
};

findBest();
