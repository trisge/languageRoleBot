// JavaScript source code

const Discord = require('discord.js')
const fs = require('fs')
//const ontime = require('ontime')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
const commands = JSON.parse(fs.readFileSync("commands.json","utf8"))

var client = new Discord.Client()

function cmdHelp(msg, args) {
    msg.channel.send({
        embed: {
            color: 0x4496ff,
            title: "Help",
            description: "**Use L!give or L!remove and**\nGer for German \nEng for English \nRus for Russian \nFre for French \nSpa for Spanish \nCze for Czech \nSlk for Slovak \nDan for Danish \nPol for Polnish \nIta for Italian \n**Seperate each Language by a / (Slash)** \n\n*Like L!give Eng/Rus to get Role Eng and Rus*"
        }
    });
}

function check(msg) {
	var guild = msg.guild,
		roles = [],
		guiltyPlayer = [],
		roleNoLang = guild.roles.find("name", "NoLanguage")
		//guild = client.guilds.find("name", "COBRA")

	if(guild.available) {
		var players = guild.members
		//Chooses every other Role from commands List. 
		for (var i=0; i < commands.lang.length;i+=2) {
			//console.log("i: " +i + ", Role: " + commands.lang[i])
			roles.push(guild.roles.find("name" , commands.lang[i]))
			//console.log(roles)
		}

		players.forEach(function (p){
			var playerRoles = p.roles,
				hasLangRole = false
			if(p.id != client.user.id) {
				//console.log(p.user.username)
				playerRoles.forEach (function(r){
					if(roles.includes(r)) {
						hasLangRole = true
					}
				})
				if(!hasLangRole) {
					guiltyPlayer.push(p)
					p.addRole(roleNoLang)
					//console.log(p.user.username)
				} else {
					if(p.roles.find("name", "NoLanguage")) {
						p.removeRole(roleNoLang)
					}
				}
			}
		})
		
	}
}

function remind(msg) {
	var message = "Guys and girls use the bot to get a language assigned.\nUse **L!**Help to see all possible commands and languages\n"
		guild = msg.guild,
		roleNoLang = guild.roles.find("name", "NoLanguage")

	message += `${roleNoLang}`
	/*guiltyPlayer.forEach(function(p){
		message += `${p} `
	})*/

	var langAss = guild.channels.find("name", "language-assignment")
	langAss.send(message)

}



/*ontime({
	cycle: "12:00:00"
},	function (ot) {
	

	ot.done()
	return
}
})*/

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}...`)
})

client.on("message", (msg) => {
    var cont = msg.content,
        author = msg.member,
        chan = msg.channel,
        guild = msg.guild,
        roleNoLang = guild.roles.find("name", "NoLanguage")

    if (author.id != client.user.id && cont.startsWith(config.prefix)) {
        var langAss = guild.channels.find("name", "language-assignment")
        if (chan == langAss) {
            var invoke = cont.split(" ")[0].substring(config.prefix.length),
                args = cont.substring(config.prefix.length + 1 + invoke.length).split("/")

            console.log(invoke, args)
            if (invoke == "give") {
                var rightCMD = false
                var mes = `${author} Was added to Role `;
                var com = commands.lang
                //console.log(com)
                console.log("Issued by: " + author.user.username)

                for (var i = 0; i < args.length; i++) {
                    //console.log(i)
                    //console.log(args[i])
                    var index = com.indexOf(args[i])
                    if (index > -1) {
                        var authRole = author.roles.find("name", String(com[index]))
                        var authRole2 = author.roles.find("name", String(com[index - 1]))
                        if (!(authRole || authRole2)) {
                            var role = guild.roles.find("name", com[index])
                            if (role) {
                                mes += com[index] + " "
                                rightCMD = true
                                author.addRole(role)
                            } else {
                                var role = guild.roles.find("name", com[index - 1])
                                if (role) {
                                    mes += com[index - 1] + " "
                                    rightCMD = true
                                    author.addRole(role)
                                }
                            }
                            if(author.roles.find("name", "NoLanguage")) {
                            	author.removeRole(roleNoLang)
                            }
                        }
                    }
                }

                if (rightCMD) {
                    chan.send(mes)
                } else {
                    chan.send(`${author} No further Language recognised. For Help use **L!help**`)
                }

            } else if (invoke == "remove") {
                var rightCMD = false
                var mes = `${author} Was removed from Role `;
                var com = commands.lang
                console.log("Issued by: " + author.user.username)

                for (var i = 0; i < args.length; i++) {
                    //console.log(args[i])
                    var index = com.indexOf(args[i])
                    var authRole = author.roles.find("name", String(com[index]))
                    var authRole2 = author.roles.find("name", String(com[index - 1]))
                    if (authRole || authRole2) {
                        var role = author.roles.find("name", com[index])
                        if (role) {
                            mes += com[index] + " "
                            rightCMD = true
                            author.removeRole(role)
                        } else {
                            var role = author.roles.find("name", com[index - 1])
                            if (role) {
                                mes += com[index - 1] + " "
                                rightCMD = true
                                author.removeRole(role)
                            }
                        }
                    }
                }

                if (rightCMD) {
                    chan.send(mes)
                } else {
                    chan.send(`${author} No further Language recognised. For Help use **L!help**`)
                }

            } else if (invoke == "help") {
                cmdHelp(msg, args);
            } else if (invoke == "remind" && author.roles.find("name", "Leader")) {
            	console.log("Issued by: " + author.user.username)
            	remind(msg)
            } else if (invoke == "check" && author.roles.find("name", "Leader")) {
            	console.log("Issued by: " + author.user.username)
            	check(msg)
            }
        }
    }
})

client.login(process.env.BOT_TOKEN)
