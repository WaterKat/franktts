const database = {
    'fariaorion': {
        admin: {
            blacklist: [
                'nightbot',
                'streamelements',
                'soundalerts',
                'streamlabs',
                'botterkat',
                'kofistreambot',
            ],
        },
        filters: {
            emotes: {
                whitelist: [
                    '7tv'
                ],
            },
        },
        pngTuber: {
            sources: [
                "https://resources.aonyxlimited.com/frank/0.png",
                "https://resources.aonyxlimited.com/frank/1.png",
                "https://resources.aonyxlimited.com/frank/2.png",
                "https://resources.aonyxlimited.com/frank/3.png",
                "https://resources.aonyxlimited.com/frank/4.png",
                "https://resources.aonyxlimited.com/frank/5.png",
                "https://resources.aonyxlimited.com/frank/6.png",
                "https://resources.aonyxlimited.com/frank/7.png",
                "https://resources.aonyxlimited.com/frank/8.png",
                "https://resources.aonyxlimited.com/frank/9.png",
                "https://resources.aonyxlimited.com/frank/10.png",
            ]
        },
        behaviour: {
            raid: {
                ignoreFirstMessageForSeconds: 30,
            }
        },
        responses:
        {
            follower: [
                "Thanks for following, ${username}! Enjoy the cosmic journey!",
                "Welcome, ${username}! Let's explore the universe together!",
                "Appreciate the follow, ${username}! Your support means the world!",
                "Glad to have you as a follower, ${username}! May your galactic journey be amazing!",
                "Welcome to the Orion constellation, ${username}! Get ready for an out-of-this-world experience!",
                "Hey there, ${username}! Join our interplanetary gaming adventure!",
                "Welcome to the Orion constellation, ${username}! Let's conquer galaxies together!",
                "Thanks for joining our celestial realm, ${username}! Get ready for cosmic gameplay!",
                "Step into the cosmic portal, ${username}! Let's explore virtual galaxies!",
                "Thank you for joining our cosmic caravan, ${username}! Let's traverse the universe!",
                "Calling all star beans! ${username} has followed. Get ready for an epic gaming odyssey!",
                "Prepare for a cosmic odyssey, ${username}! Explore the universe in games!",
            ],
            sub: [
                "Thanks ${username} for ${sub.length} stellar months of support!",
                "Celestial cheers, ${username}! Join us for ${sub.length} months of cosmic exploration!",
                "Shoutout to ${username}! ${sub.length} months in our Orion Constellation! Your subscription powers our cosmic journey.",
                "Appreciate your subscription, ${username}! ${sub.length} months of cosmic commitment!",
                "Welcome, ${username}! Explore the cosmos with us for ${sub.length} months!",
                "Cosmic gratitude, ${username}! ${sub.length} stellar months of support!",
                "Celestial greetings, ${username}! A ${sub.length}-month subscription shining like a supernova.",
                "Stellar salute, ${username}! ${sub.length} months of loyal star bean support!",
                "Celestial blessings, ${username}! Keep the cosmic energy flowing with your ${sub.length}-month subscription.",
                "Thanks ${username} for the ${sub.length}-month cosmic subscription! Your commitment fuels us.",
                "Welcome back, ${username}! ${sub.length}-month subscription adding celestial sparkles!",
                "Thanks ${username} for ${sub.length} stellar months! Your support ignites us.",
                "Celestial applause, ${username}! ${sub.length}-month subscription guiding us.",
                "Thanks ${username} for the ${sub.length}-month interstellar subscription! Your support fuels us.",
                "Celestial waves to ${username}! ${sub.length} months as a star bean in the Orion constellation!",
                "Cosmic shoutout, ${username}! ${sub.length}-month subscription lighting up our stream.",
                "Thanks ${username} for being a stellar star bean! ${sub.length} months of support!",
                "Celestial high fives, ${username}! ${sub.length}-month subscription fueling our cosmic adventures!",
            ],
            'gift-single': [
                "Stellar shoutout to ${gift.sender} for the generous gift! Welcome, ${username}! Enjoy the cosmic journey!",
                "Celestial cheers to ${gift.sender} for the amazing gift! ${username}, join the starbeans for an incredible experience!",
                "Thank you, ${gift.sender}, for the interstellar gift! Welcome to the cosmic family, ${username}!",
                "Celestial gratitude to ${gift.sender} for the generous gift! Welcome aboard, ${username}! Your cosmic journey begins!",
                "Thank you, ${gift.sender}, for the stellar gift! Join our celestial journey, ${username}!",
                "Celestial shoutout to ${gift.sender} for the amazing gift! Welcome to the star beans, ${username}!",
                "Celestial applause to ${gift.sender} for the incredible gift! Welcome to the Orion constellation, ${username}!",
                "Cosmic salute to ${gift.sender} for the generous gift! Enjoy interplanetary gaming, ${username}!",
                "Thank you, ${gift.sender}, for the interstellar gift! Explore the vast reaches of space, ${username}!",
                "Stellar shoutout to ${gift.sender} for the amazing gift! Brighten our cosmic stream, ${username}!",
                "Thank you, ${gift.sender}, for the cosmic gift! Launch us to new gaming heights, ${username}!",
                "Thank you, ${gift.sender} for the stellar gift! Ignite the cosmic fire, ${username}!",
                "Celestial cheers to ${gift.sender} for the amazing gift! Light up our stream, ${username}!",
                "Thank you, ${gift.sender}, for the cosmic gift! Your loyalty fuels us, ${username}!",
                "Stellar shoutout to ${gift.sender} for the incredible gift! Fuel our cosmic adventures, ${username}!",
                "Celestial gratitude to ${gift.sender} for the generous gift! Set the course for intergalactic voyage, ${username}!",
            ],
            'gift-bomb-sender': [
                "Cosmic shoutout to ${gift.sender} for an epic star bean supernova of ${gift.count} subscriptions, igniting our stream with celestial fire!",
                "Incoming star bean supernova! Massive thanks to ${gift.sender} for gifting ${gift.count} subscriptions, creating a cosmic explosion of excitement!",
                "Hold on tight, star beans! We've encountered a supernova! Thanks to ${gift.sender} for igniting ${gift.count} subscriptions!",
                "Alert! Witnessed a star bean supernova! Thanks ${gift.sender} for fueling our stream with ${gift.count} subscriptions!",
                "Thrilled to welcome new star beans to the Orion Constellation! Thanks ${gift.sender} for bringing ${gift.count} subscriptions!",
                "Stellar shoutout to ${gift.sender} for a star bean supernova of ${gift.count}, illuminating our stream with cosmic power!",
                "Hold on tight! Prepare for a star bean supernova! Enormous thanks to ${gift.sender} for gifting ${gift.count} subscriptions!",
                "Honored to have you as part of our supernova-powered community, ${gift.sender}! Welcome ${gift.count} new star beans to an intergalactic thrill ride!",
            ],
            raid: [
                "Meteor shower alert! ${username} is bringing ${raid.count} raiders for a cosmic adventure!",
                "Incoming meteor shower! Thanks ${username} for bringing ${raid.count} raiders!",
                "Cosmic raiders on the radar! Welcome ${username} and your community of ${raid.count}!",
                "Brace for impact! ${username} brings ${raid.count} raiders to storm our cosmic sanctuary!",
                "Cosmic raid unleashed! Thanks ${username} for bringing your community of ${raid.count}!",
                "Welcome raiders! ${username} brings ${raid.count} raiders like a meteor shower!",
                "Incoming meteor shower! Thanks ${username} for bringing ${raid.count} raiders!",
                "Attention star beans! ${username} and ${raid.count} raiders are incoming!",
            ],
        },
    },
};

function getCollection(_key) {
    return database[_key];
}

module.exports = {
    getCollection : getCollection,
};
