### About

Very simple Pandemic simulator.

The goal is to be able to evaluate the impact of the various social distancing principle.

### Principles

**Buildings**

Building are dispatched on a set of tiles and have a type:

  - HOUSE
  - SCHOOL
  - SHOP
  - COMPANY
  - HOSPITAL
  - VENUE
  - RESTAURANT

Each building has a location and a capacity.

**People**

People are initially assigned to a home.

Each person is assigned a schedule that define where they go during the day:

 - work
 	- adults go a work (shop/restaurant/company)
 	- children go to school
 	- older people may go to work
 - misc
 	- go shopping
 	- go to venues

The idea is that "social distancing" policies will impac the schedule and the schedule will impact how people gather and it will in return impact how the virus spread.

**Virus**

The virus has a lifecycle

 - present but not active
 - active: the host becomes infectious
 - the host becomes sick
 - kill the host or killed by the host

The host schedule and behavior is impacted by the virus. 

The virus lethality depending on the host age.

The virus spead to people that stay in the neighborhood of an infected host during several rounds.


### Demo

Click [here](https://tiry.github.io/p5js-samples/social-distance/index.html) to see the simlation.