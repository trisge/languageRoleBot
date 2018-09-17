// JavaScript source code

const Discord = require('discord.js')
const fs = require('fs')
//const ontime = require('ontime')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
const commands = JSON.parse(fs.readFileSync("commands.json","utf8"))

var client = new Discord.Client()

function cmdHelp(msg, args) {
    var languages = "",
        guild = msg.guild,
        roleReady = false,
        avCom = []

    for (var i = 0; i < commands.lang.length; i++) {
        if (guild.roles.find("name", commands.lang[i])) {
            descr = commands.descr[i]
            avCom.push(commands.lang[i])
            languages += "\n" + descr
            roleReady = true;
            //console.log("Found Lang: " + commands.lang[i])
        }
    }
    if (roleReady) {
        msg.channel.send({
            embed: {
                color: 0x4496ff,
                title: "Help",
                description: "**Use L!give or L!remove and**" + languages + "\n**Seperate each Language by a / (Slash)** \n\n*Like L!give " + avCom[0]+ "/" + avCom[1] + " to get Role Eng and Rus*"
            }
        });
    } else {
        msg.channel.send({
            embed: {
                color: 0x4496ff,
                title: "Help",
                description: "No language roles setup."
            }
        });
    }
}

function check(msg) {
    var guild = msg.guild,
        roles = []
		guiltyPlayer = [],
		roleNoLang = guild.roles.find("name", "NoLanguage")
    if (roleNoLang != null) {
        if (guild.available) {
            var players = guild.members
            //Get every Role from commands List which is active. 
            for (var i = 0; i < commands.lang.length; i++) {
                //console.log("i: " +i + ", Role: " + commands.lang[i])
                roles.push(guild.roles.find("name", commands.lang[i]))
                //console.log(roles)
            }

            players.forEach(function (p) {
                var playerRoles = p.roles,
                    hasLangRole = false
                if (p.id != client.user.id) {
                    console.log(p.user.username)
                    playerRoles.forEach(function (r) {
                        if (roles.includes(r)) {
                            hasLangRole = true
                        }
                    })
                    if (!hasLangRole) {
                        guiltyPlayer.push(p)
                        p.addRole(roleNoLang)
                        //console.log(p.user.username)
                    } else {
                        if (p.roles.find("name", "NoLanguage")) {
                            p.removeRole(roleNoLang)
                        }
                    }
                }
            })
        }
    } else {
        msg.channel.send(`${msg.author} There is no role **NoLanguage**. Please add the role before using L!check.`)
    }
}   

function remind(msg) {
	var message = "Guys and girls use the bot to get a language assigned.\nUse **L!**help to see all possible commands and languages\n"
		guild = msg.guild,
		roleNoLang = guild.roles.find("name", "NoLanguage")
	message += `${roleNoLang}`
    var langAss = guild.channels.find("name", "language-assignment")
    if (roleNoLang == null) {
        langAss.send(`${msg.author} There is no role **NoLanguage** to notify. Please add the role before using L!remind.`)
    } else {
        langAss.send(message)
    }

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
            if (invoke.toLowerCase() == "give") {
                var rightCMD = false
                var mes = `${author} Was added to Role `;
                var com = commands.lang
                //console.log(com)
                console.log("Issued by: " + author.user.username)

                for (var i = 0; i < args.length; i++) {
                    //console.log(i)
                    //console.log(args[i].toUpperCase())           
                    var index = com.indexOf(args[i].toUpperCase())
                    //console.log(index)
                    if (index > -1) {
                        var command = com[index],
                            authRole = author.roles.find("name", command)
                        if (!authRole) {
                            var role = guild.roles.find("name", command)
                            if (role) {
                                mes += command + " "
                                rightCMD = true
                                author.addRole(role)
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

            } else if (invoke.toLowerCase() == "remove") {
                var rightCMD = false
                var mes = `${author} Was removed from Role `;
                var com = commands.lang
                console.log("Issued by: " + author.user.username)

                for (var i = 0; i < args.length; i++) {
                    //console.log(i)
                    //console.log(args[i].toUpperCase())
                    var index = com.indexOf(args[i].toUpperCase())
                    if (index > -1) {
                        var command = com[index].toUpperCase(),
                            authRole = author.roles.find("name", command)
                        if (authRole != null) {
                            var role = guild.roles.find("name", command)
                            if (role) {
                                mes += command + " "
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

            } else if (invoke.toLowerCase() == "help") {
                cmdHelp(msg, args);
                console.log("Issued by: " + author.user.username)
            } else if (invoke.toLowerCase() == "remind" && author.roles.find("name", "Bot Commander")) {
            	console.log("Issued by: " + author.user.username)
            	remind(msg)
            } else if (invoke.toLowerCase() == "check" && author.roles.find("name", "Bot Commander")) {
            	console.log("Issued by: " + author.user.username)
            	check(msg)
            }
        }
    }
})

client.login(process.env.BOT_TOKEN)
