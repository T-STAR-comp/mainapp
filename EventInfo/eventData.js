const createTicketURL = process.env.CREATETICKETURL;

const EventData = [
    {
      createTicketURL : process.env.CREATETICKETURL,
      makeTicketPayment : process.env.PAYMENT_URL,
    },

    {
        id:1,
        eventName:'The Best Of Gwamba',
        image:'https:image/url',
        venue:'civo stadium',
        location:'Area 47,Lilongwe',
        date1:'23 sep',
        date2:'23 sep 2024',
        time:'10:30 am',
        imageUrl:'https://i.postimg.cc/nzqCK8xQ/gwamba-concert.jpg',
        stdPrice: 15000,
        vipPrice: 25000,
        QrUrl: createTicketURL,
        StandardBseIdentifier: 'gwambaconcert//code//ticket//standard',
        VipBseIdentifier: 'gwambaconcert//code//ticket//vip',
        eventdescription:'This will be yet another spectacular annual Gwamba concert with special pperformances from International SA superstar Focalistic. This will be a must go to Event. Get your ticket below.',
    },
    {
        id:2,
        eventName:'Young Stunna Malawi',
        image:'https:image/url',
        venue:'BeerLand Festival',
        location:'Chilomoni, Blantyre',
        date1:'25 July',
        date2:'25 July 2024',
        time:'18:00',
        imageUrl:'https://i.postimg.cc/Gtr9qM3g/download.jpg',
        stdPrice: 5000,
        vipPrice: 20000,
        QrUrl: createTicketURL,
        StandardBseIdentifier: 'youngstunnaconcert//code//ticket//standard',
        VipBseIdentifier: 'youngstunnaconcert//code//ticket//vip',
        eventdescription:'hello world',
    }
]

module.exports = {EventData}