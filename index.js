import chalk from "chalk";
import inquirer from "inquirer";
import figlet from 'figlet';
import fs from 'fs/promises'


let UsedWords = []
let winner = false
let usedLetters = new Set()

console.clear()
let getword = async function(){
   let wordReturn = await fs.readFile('./words.txt', 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
            }
            let arr = data.split('\n')
            console.log(arr)
            return arr
        }   
    )
    let arr = (await wordReturn).split('\n')
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear

    return await arr[(month * day * month)%arr.length]
}

//console.log(await getword())





let MakeGuess = async () => { 
    let question = await inquirer.prompt({ 
        name: 'player_guess',
        message: `Make a guess: `,
        type: 'input',
        validate: function(input){ 
            if(input.length > 5){ 
                console.log(chalk.red('\n Word is too long (5 letters)'))
                return false
            }
            if(input.length < 5){ 
                console.log(chalk.red('\n Word is too short (5 letters)'))
                return false
            }
            return true
        },
        
    })
    console.clear()
    return question.player_guess
}




let dipsplay = async () => { 
    UsedWords.forEach(el => { 
        el.input.forEach(element => { 
            const {value, letter} =  element
            if(value == 2){ 
                process.stdout.write(chalk.bgGreen(`  ${chalk.black(letter)}  \t`))

            }else if(value == 1){ 
                process.stdout.write(chalk.bgYellow(`  ${chalk.black(letter)}  \t`))
            }else{ 
                process.stdout.write(`${letter}\t`)
            }

           
        })
        console.log()
        
    })
    console.log()
    console.log()
}

let checkAnswer = async (value, solution) => { 
    value = value.toLowerCase();
    solution = solution.toLowerCase();
    if (value === solution){
        figlet('Winner', (err, data) => { 
            console.clear()
            if(err){ 
                console.error(err)
            }
            console.log(data)
            dipsplay()
        })
        winner = true
    }

    let res = {
        input: []
    }
    let guess = value.split('')
    let sol = solution.split('')

    
    

    guess.forEach((el, inx) => {
        usedLetters.add(el)
        if(sol[inx] == el){ 
            res.input.push({letter: el, value: 2})
        }else if(sol.includes(el)){
            res.input.push({letter: el, value: 1})
        }else{
            res.input.push({letter: el, value: 0})
        }

    });

    UsedWords.push(res)
    return await dipsplay;
}





while(UsedWords.length != 4 && !winner){ 

    let guess = await MakeGuess()
    await checkAnswer(await guess, await getword())
    await dipsplay()
}
