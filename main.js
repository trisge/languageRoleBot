// JavaScript source code

const Discord = require('discord.js')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json','utf8'))

var client = new Discord.Client()

function cmdHelp(msg, args) {
    msg.channel.send({
        embed: {
            color: 0x4496ff,
            title: "Help",
            description: "Use L!give or L!remove and \nGer for German \nEng for English \nRus for Russian \nFre for French \nSpa for Spanish \nCze for Czech \nSlk for Slovak \n**Seperate each Language by a / (Slash)**"
        }
    });
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}...`)
})

client.on("message", (msg) => {
    var cont = msg.content,
        author = msg.member,
        chan = msg.channel,
        guild = msg.guild

    if (author.id != client.user.id && cont.startsWith(config.prefix)) {
        var invoke = cont.split(" ")[0].substring(config.prefix.length),
            args = cont.substring(config.prefix.length + 1 + invoke.length).split("/")

        console.log(invoke, args)
        if (invoke == "give") {
            var rightCMD = false;
            var mes = `${author} Was added to Role `;

            if (args.indexOf("Ger") > -1 || args.indexOf("ger") > -1) {
                var role = guild.roles.find("name", "Ger")
                mes += "Ger "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Eng") > -1 || args.indexOf("eng") > -1) {
                var role = guild.roles.find("name", "Eng")
                mes += "Eng "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Rus") > -1 || args.indexOf("rus") > -1) {
                var role = guild.roles.find("name", "Rus")
                mes += "Rus "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Fre") > -1 || args.indexOf("fre") > -1) {
                var role = guild.roles.find("name", "Fre")
                mes += "Fre "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Spa") > -1 || args.indexOf("spa") > -1) {
                var role = guild.roles.find("name", "Spa")
                mes += "Spa "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Cze") > -1 || args.indexOf("cze") > -1) {
                var role = guild.roles.find("name", "Cze")
                mes += "Cze "
                rightCMD = true
                author.addRole(role)
            }

            if (args.indexOf("Slk") > -1 || args.indexOf("slk") > -1) {
                var role = guild.roles.find("name", "Slk")
                mes += "Slk "
                rightCMD = true
                author.addRole(role)
            }

            if (rightCMD) {
                chan.send(mes)
            } else {
                chan.send(`${author} no Language recognised`)
            }

        }else if (invoke == "remove") {
            var mes = `${author} Was removed from Role `;

            if (args.indexOf("Ger") > -1 || args.indexOf("ger") > -1) {
                var role = guild.roles.find("name", "Ger")
                mes += "Ger "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Eng") > -1 || args.indexOf("eng") > -1) {
                var role = guild.roles.find("name", "Eng")
                mes += "Eng "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Rus") > -1 || args.indexOf("rus") > -1) {
                var role = guild.roles.find("name", "Rus")
                mes += "Rus "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Fre") > -1 || args.indexOf("fre") > -1) {
                var role = guild.roles.find("name", "Fre")
                mes += "Fre "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Spa") > -1 || args.indexOf("spa") > -1) {
                var role = guild.roles.find("name", "Spa")
                mes += "Spa "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Cze") > -1 || args.indexOf("cze") > -1) {
                var role = guild.roles.find("name", "Cze")
                mes += "Cze "
                rightCMD = true
                author.removeRole(role)
            }

            if (args.indexOf("Slk") > -1 || args.indexOf("slk") > -1) {
                var role = guild.roles.find("name", "Slk")
                mes += "Slk "
                rightCMD = true
                author.removeRole(role)
            }

            if (rightCMD) {
                chan.send(mes)
            } else {
                chan.send(`${author} no Language recognised`)
            }
            
        } else if (invoke == "help") {
            cmdHelp(msg, args);
        }
    }

})

client.login(process.env.BOT_TOKEN)
