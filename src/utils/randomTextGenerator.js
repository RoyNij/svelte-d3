/**
 * WORDS are based on https://blog.codinghorror.com/new-programming-jargon/
 */

const WORDS = [
    "yoda",
    "conditions",
    "pokémon",
    "exception",
    "handling",
    "egyptian",
    "brackets",
    "smug",
    "report",
    "duck",
    "rubber",
    "refuctoring",
    "stringly",
    "typed",
    "heisenbug",
    "doctype",
    "decoration",
    "jimmy",
    "higgs-bugson",
    "nopping",
    "unicorny",
    "baklava",
    "code",
    "hindenbug",
    "fear",
    "driven",
    "development",
    "hydra",
    "common",
    "law",
    "feature",
    "loch",
    "ness",
    "monster",
    "bug",
    "ninja",
    "comment",
    "smurf",
    "naming",
    "convention",
    "protoduction",
    "ducking",
    "banana",
    "programmer",
    "fuel",
    "hot",
    "potato",
    "cake",
    "chunky",
    "salsa",
    "bicrement",
    "reality",
    "101",
    "failure",
    "mad",
    "girlfriend",
    "megamoth",
    "god",
    "object",
    "hooker",
    "jenga",
]

export function generateWords( n ){
    let words = []
    for(var i = 0; i < n; i++){
        let word = WORDS[Math.floor(Math.random()*WORDS.length)]
        words.push(word)
    }
    return words.join(" ");
}