import type { ImageSourcePropType } from 'react-native';

// React Native requires static literal paths in require(), so bundled images
// must be registered explicitly. Each lesson card references a key here.
// Real artwork (AI-generated or curated) drops into assets/images/<level>/ and
// gets wired up below — no schema or data changes needed.
// Cards whose real photo has not been added yet point straight at placeholder.png
// (no shared constant, so replacing one is just swapping that filename). To add a
// photo: drop the file into assets/images/a1/ and swap the require() path below
// (search this file for "TODO photo" to find every card still on the placeholder).

const registry: Record<string, ImageSourcePropType> = {
  'a1/boy': require('../../assets/images/a1/boy.png'),
  'a1/girl': require('../../assets/images/a1/girl.png'),
  'a1/dog': require('../../assets/images/a1/dog.png'),
  'a1/dog-run': require('../../assets/images/a1/dog-run.png'),
  'a1/boy-eat': require('../../assets/images/a1/boy-eat.png'),
  'a1/girl-happy': require('../../assets/images/a1/girl-happy.png'),
  'a1/dog-run-fast': require('../../assets/images/a1/dog-run-fast.png'),
  'a1/boy-sad': require('../../assets/images/a1/boy-sad.png'),
  'a1/dog-angry': require('../../assets/images/a1/dog-angry.png'),
  'a1/girl-sad': require('../../assets/images/a1/girl-sad.png'),
  'a1/cat':        require('../../assets/images/a1/cat.jpg'),
  'a1/cat-sleep':  require('../../assets/images/a1/cat-sleep.jpg'),
  'a1/dog-big':    require('../../assets/images/a1/dog-big.jpg'),
  'a1/cat-small':  require('../../assets/images/a1/cat-small.jpg'),
  'a1/dog-jump':   require('../../assets/images/a1/dog-jump.jpg'),
  'a1/boy-drink':  require('../../assets/images/a1/boy-drink.png'),
  'a1/girl-play':  require('../../assets/images/a1/girl-play.png'),
  'a1/dog-walk':   require('../../assets/images/a1/dog-walk.jpg'),
  'a1/bird':       require('../../assets/images/a1/bird.jpg'),
  'a1/fish':       require('../../assets/images/a1/fish.jpg'),
  // People
  'a1/man':          require('../../assets/images/a1/man.jpg'),
  'a1/man-old':      require('../../assets/images/a1/man-old.png'),
  'a1/woman':        require('../../assets/images/a1/woman.jpg'),
  'a1/woman-young':  require('../../assets/images/a1/woman-young.jpg'),
  'a1/baby':         require('../../assets/images/a1/baby.jpg'),
  'a1/mother':       require('../../assets/images/a1/mother.jpg'),
  'a1/father':       require('../../assets/images/a1/father.jpg'),
  'a1/brother':      require('../../assets/images/a1/brother.jpg'),
  'a1/sister':       require('../../assets/images/a1/sister.jpg'),
  'a1/grandma':      require('../../assets/images/a1/grandma.jpg'),
  'a1/grandpa':      require('../../assets/images/a1/grandpa.jpg'),
  // Colors
  'a1/color-red':    require('../../assets/images/a1/color-red.jpg'),
  'a1/color-blue':   require('../../assets/images/a1/color-blue.jpg'),
  'a1/color-green':  require('../../assets/images/a1/color-green.jpg'),
  'a1/color-yellow': require('../../assets/images/a1/color-yellow.png'),
  'a1/color-white':  require('../../assets/images/a1/color-white.jpg'),
  'a1/color-black':  require('../../assets/images/a1/color-black.jpg'),
  'a1/color-orange': require('../../assets/images/a1/color-orange.jpg'),
  'a1/color-pink':   require('../../assets/images/a1/color-pink.png'),
  // Food
  'a1/apple':        require('../../assets/images/a1/apple.jpg'),
  'a1/banana':       require('../../assets/images/a1/banana.jpg'),
  'a1/water':        require('../../assets/images/a1/water.jpg'),
  'a1/boy-drink-water':        require('../../assets/images/a1/boy-drink-water.png'),
  'a1/cat-drink-milk':        require('../../assets/images/a1/cat-drink-milk.png'),
  'a1/woman-eating-eggs':        require('../../assets/images/a1/woman-eating-eggs.png'),
  'a1/man-eating-rice':        require('../../assets/images/a1/man-eating-rice.png'),
  'a1/milk':         require('../../assets/images/a1/milk.jpg'),
  'a1/bread':        require('../../assets/images/a1/bread.jpg'),
  'a1/egg':          require('../../assets/images/a1/egg.jpg'),
  'a1/rice':         require('../../assets/images/a1/rice.jpg'),
  'a1/soup':         require('../../assets/images/a1/soup.png'),
  // Home
  'a1/table':        require('../../assets/images/a1/table.png'),
  'a1/chair':        require('../../assets/images/a1/chair.jpg'),
  'a1/bed':          require('../../assets/images/a1/bed.png'),
  'a1/book':         require('../../assets/images/a1/book.jpg'),
  'a1/bag':          require('../../assets/images/a1/bag.jpg'),
  'a1/cup':          require('../../assets/images/a1/cup.jpg'),
  'a1/door':         require('../../assets/images/a1/door.jpg'),
  'a1/window':       require('../../assets/images/a1/window.jpg'),
  'a1/house':        require('../../assets/images/a1/house.jpg'),
  'a1/car':          require('../../assets/images/a1/car.jpg'),
  'a1/phone':        require('../../assets/images/a1/phone.jpg'),
  // Body
  'a1/head':         require('../../assets/images/a1/head.jpg'),
  'a1/eye':          require('../../assets/images/a1/eye.jpg'),
  'a1/ear':          require('../../assets/images/a1/ear.jpg'),
  'a1/nose':         require('../../assets/images/a1/nose.jpg'),
  'a1/mouth':        require('../../assets/images/a1/mouth.jpg'),
  'a1/hand':         require('../../assets/images/a1/hand.jpg'),
  'a1/foot':         require('../../assets/images/a1/foot.jpg'),
  'a1/arm':          require('../../assets/images/a1/arm.jpg'),
  'a1/leg':          require('../../assets/images/a1/leg.jpg'),
  // Animals
  'a1/horse':        require('../../assets/images/a1/horse.jpg'),
  'a1/cow':          require('../../assets/images/a1/cow.jpg'),
  'a1/rabbit':       require('../../assets/images/a1/rabbit.png'),
  'a1/bear':         require('../../assets/images/a1/bear.jpg'),
  'a1/turtle':       require('../../assets/images/a1/turtle.jpg'),
  // Actions
  'a1/dog-sit':      require('../../assets/images/a1/dog-sit.jpg'),
  'a1/man-stand':    require('../../assets/images/a1/man-stand.jpg'),
  'a1/girl-read':    require('../../assets/images/a1/girl-read.jpg'),
  'a1/boy-write':    require('../../assets/images/a1/boy-write.png'),
  'a1/man-talk':     require('../../assets/images/a1/man-talk.jpg'),
  'a1/girl-listen':  require('../../assets/images/a1/girl-listen.jpg'),
  'a1/man-go':       require('../../assets/images/a1/man-go.jpg'),
  'a1/dog-come':     require('../../assets/images/a1/dog-come.png'),
  'a1/man-open':     require('../../assets/images/a1/man-open.jpg'),
  'a1/boy-give':     require('../../assets/images/a1/boy-give.jpg'),
  'a1/boy-see':      require('../../assets/images/a1/boy-see.jpg'),
  'a1/boy-swim':     require('../../assets/images/a1/boy-swim.jpg'),
  'a1/buy':          require('../../assets/images/a1/buy.jpg'),
  'a1/think':        require('../../assets/images/a1/think.jpg'),
  'a1/make':         require('../../assets/images/a1/make.jpg'),
  'a1/stop':         require('../../assets/images/a1/stop.png'),
  'a1/ask':          require('../../assets/images/a1/ask.jpg'),
  'a1/find':         require('../../assets/images/a1/find.png'),
  'a1/say':          require('../../assets/images/a1/say.png'),
  'a1/wait':         require('../../assets/images/a1/wait.jpg'),
  'a1/wake':         require('../../assets/images/a1/wake.png'),
  'a1/meet':         require('../../assets/images/a1/meet.png'),
  'a1/take':         require('../../assets/images/a1/take.png'),
  'a1/put':          require('../../assets/images/a1/put.png'),
  'a1/work':         require('../../assets/images/a1/work.png'),
  'a1/learn':        require('../../assets/images/a1/learn.png'),
  'a1/start':        require('../../assets/images/a1/start.png'),
  'a1/fall':         require('../../assets/images/a1/fall.png'),
  'a1/hear':         require('../../assets/images/a1/hear.png'),
  'a1/leave':        require('../../assets/images/a1/leave.png'),
  'a1/adj-strong':   require('../../assets/images/a1/strong.png'),
  'a1/adj-nice':     require('../../assets/images/a1/adj-nice.png'),
  // Adjectives
  'a1/hot':          require('../../assets/images/a1/hot.jpg'),
  'a1/cold':         require('../../assets/images/a1/cold.jpg'),
  'a1/dog-good':     require('../../assets/images/a1/dog-good.jpg'),
  'a1/cat-bad':      require('../../assets/images/a1/cat-bad.jpg'),
  'a1/man-tall':     require('../../assets/images/a1/man-tall.jpg'),
  'a1/woman-short':  require('../../assets/images/a1/woman-short.png'),
  'a1/road-long':    require('../../assets/images/a1/road-long.jpg'),
  'a1/adj-new':       require('../../assets/images/a1/adj-new.jpg'),
  'a1/adj-dirty':     require('../../assets/images/a1/adj-dirty.jpg'),
  'a1/adj-clean':     require('../../assets/images/a1/adj-clean.jpg'),
  'a1/adj-warm':      require('../../assets/images/a1/adj-warm.png'),
  'a1/adj-beautiful': require('../../assets/images/a1/adj-beautiful.jpg'),
  'a1/adj-dark':      require('../../assets/images/a1/adj-dark.jpg'),
  'a1/adj-full':      require('../../assets/images/a1/adj-full.jpg'),
  'a1/adj-funny':     require('../../assets/images/a1/adj-funny.png'),
  'a1/adj-quiet':     require('../../assets/images/a1/adj-quiet.jpg'),
  'a1/adj-hard':      require('../../assets/images/a1/adj-hard.jpg'),
  'a1/adj-healthy':   require('../../assets/images/a1/adj-healthy.jpg'),
  'a1/adj-large':     require('../../assets/images/a1/adj-large.jpg'),
  // Nature
  'a1/tree':         require('../../assets/images/a1/tree.jpg'),
  'a1/flower':       require('../../assets/images/a1/flower.jpg'),
  'a1/sun':          require('../../assets/images/a1/sun.jpg'),
  'a1/rain':         require('../../assets/images/a1/rain.jpg'),
  'a1/snow':         require('../../assets/images/a1/snow.jpg'),
  'a1/cloud':        require('../../assets/images/a1/cloud.jpg'),
  'a1/ball':         require('../../assets/images/a1/ball.jpg'),
  // Numbers
  'a1/num-one':      require('../../assets/images/a1/1-apple.png'),
  'a1/num-two':      require('../../assets/images/a1/num-two.jpg'),
  'a1/num-three':    require('../../assets/images/a1/3-oranges.png'),
  'a1/num-four':     require('../../assets/images/a1/4-apples.png'),
  'a1/num-five':     require('../../assets/images/a1/5-grapes.png'),
  'a1/num-six':      require('../../assets/images/a1/6-eggs.png'),
  'a1/num-seven':    require('../../assets/images/a1/7-pencils.png'),
  'a1/num-eight':    require('../../assets/images/a1/8-cars.png'),
  'a1/num-nine':     require('../../assets/images/a1/9-animals.png'),
  'a1/num-ten':      require('../../assets/images/a1/10-fishes.png'),
  // Adverbs
  'a1/adv-quietly':  require('../../assets/images/a1/adv-quietly.jpg'),
  'a1/adv-loudly':   require('../../assets/images/a1/adv-loudly.jpg'),
  'a1/adv-alone':    require('../../assets/images/a1/adv-alone.jpg'),
  'a1/adv-together': require('../../assets/images/a1/adv-together.jpg'),
  'a1/adv-outside':  require('../../assets/images/a1/adv-outside.jpg'),
  'a1/adv-inside':   require('../../assets/images/a1/adv-inside.jpg'),
  // Body (extension)
  'a1/hair':         require('../../assets/images/a1/hair.jpg'),
  'a1/face':         require('../../assets/images/a1/face.jpg'),
  'a1/tooth':        require('../../assets/images/a1/tooth.jpg'),
  // Animals (extension)
  'a1/elephant':     require('../../assets/images/a1/elephant.jpg'),
  'a1/lion':         require('../../assets/images/a1/lion.jpg'),
  'a1/sheep':        require('../../assets/images/a1/sheep.jpg'),
  'a1/snake':        require('../../assets/images/a1/snake.jpg'),
  'a1/pig':          require('../../assets/images/a1/pig.jpg'),
  'a1/mouse':        require('../../assets/images/a1/mouse.jpg'),
  // Colors (extension)
  'a1/purple':       require('../../assets/images/a1/purple.jpg'),
  'a1/grey':         require('../../assets/images/a1/grey.jpg'),
  'a1/brown':        require('../../assets/images/a1/brown.jpg'),
  // Nature (extension)
  'a1/sea':          require('../../assets/images/a1/sea.jpg'),
  'a1/river':        require('../../assets/images/a1/river.jpg'),
  'a1/mountain':     require('../../assets/images/a1/mountain.jpg'),
  'a1/island':       require('../../assets/images/a1/island.jpg'),
  'a1/rock':         require('../../assets/images/a1/rock.jpg'),
  'a1/beach':        require('../../assets/images/a1/beach.jpg'),
  'a1/farm':         require('../../assets/images/a1/farm.png'),
  'a1/garden':       require('../../assets/images/a1/garden.png'),
  'a1/plant':        require('../../assets/images/a1/plant.jpg'),
  'a1/fire':         require('../../assets/images/a1/fire.jpg'),
  'a1/ice':          require('../../assets/images/a1/ice.jpg'),
  'a1/air':          require('../../assets/images/a1/air.png'),
  'a1/spring':       require('../../assets/images/a1/spring.png'),
  'a1/summer':       require('../../assets/images/a1/summer.png'),
  'a1/autumn':       require('../../assets/images/a1/autumn.png'),
  'a1/winter':       require('../../assets/images/a1/winter.png'),
  // Jobs
  'a1/doctor':       require('../../assets/images/a1/doctor.png'),
  'a1/teacher':      require('../../assets/images/a1/teacher.jpg'),
  'a1/nurse':        require('../../assets/images/a1/nurse.png'),
  'a1/farmer':       require('../../assets/images/a1/farmer.jpg'),
  'a1/driver':       require('../../assets/images/a1/driver.jpg'),
  'a1/waiter':       require('../../assets/images/a1/waiter.jpg'),
  'a1/police':       require('../../assets/images/a1/police.jpg'),
  'a1/singer':       require('../../assets/images/a1/singer.png'),
  'a1/worker':       require('../../assets/images/a1/worker.jpg'),
  'a1/student':      require('../../assets/images/a1/student.png'),
  // Transport
  'a1/bus':          require('../../assets/images/a1/bus.jpg'),
  'a1/bike':         require('../../assets/images/a1/bike.jpg'),
  'a1/boat':         require('../../assets/images/a1/boat.jpg'),
  'a1/plane':        require('../../assets/images/a1/plane.jpg'),
  'a1/train':        require('../../assets/images/a1/train.jpg'),
  'a1/taxi':         require('../../assets/images/a1/taxi.jpg'),
  // Places
  'a1/school':       require('../../assets/images/a1/school.jpg'),
  'a1/shop':         require('../../assets/images/a1/shop.jpg'),
  'a1/park':         require('../../assets/images/a1/park.jpg'),
  'a1/hospital':     require('../../assets/images/a1/hospital.png'),
  'a1/restaurant':   require('../../assets/images/a1/restaurant.jpg'),
  'a1/hotel':        require('../../assets/images/a1/hotel.jpg'),
  'a1/cinema':       require('../../assets/images/a1/cinema.jpg'),
  'a1/cafe':         require('../../assets/images/a1/cafe.jpg'),
  'a1/airport':      require('../../assets/images/a1/airport.jpg'),
  'a1/station':      require('../../assets/images/a1/station.jpg'),
  'a1/market':       require('../../assets/images/a1/market.jpg'),
  'a1/museum':       require('../../assets/images/a1/museum.jpg'),
  'a1/library':      require('../../assets/images/a1/library.jpg'),
  'a1/office':       require('../../assets/images/a1/office.jpg'),
  'a1/bank':         require('../../assets/images/a1/bank.png'),
  'a1/city':         require('../../assets/images/a1/city.jpg'),
  'a1/town':         require('../../assets/images/a1/town.jpg'),
  'a1/village':      require('../../assets/images/a1/village.jpg'),
  'a1/street':       require('../../assets/images/a1/street.png'),
  'a1/road':         require('../../assets/images/a1/road.jpg'),
  'a1/room':         require('../../assets/images/a1/room.jpg'),
  // Objects (extension)
  'a1/clock':        require('../../assets/images/a1/clock.jpg'),
  'a1/key':          require('../../assets/images/a1/key.jpg'),
  'a1/glass':        require('../../assets/images/a1/glass.jpg'),
  'a1/bottle':       require('../../assets/images/a1/bottle.jpg'),
  'a1/box':          require('../../assets/images/a1/box.jpg'),
  'a1/desk':         require('../../assets/images/a1/desk.jpg'),
  'a1/sofa':         require('../../assets/images/a1/sofa.jpg'),
  'a1/computer':     require('../../assets/images/a1/computer.png'),
  'a1/camera':       require('../../assets/images/a1/camera.jpg'),
  'a1/umbrella':     require('../../assets/images/a1/umbrella.jpg'),
  'a1/watch':        require('../../assets/images/a1/watch.jpg'),
  'a1/pen':          require('../../assets/images/a1/pen.png'),
  'a1/pencil':       require('../../assets/images/a1/pencil.png'),
  'a1/guitar':       require('../../assets/images/a1/guitar.jpg'),
  'a1/piano':        require('../../assets/images/a1/piano.png'),
  'a1/radio':        require('../../assets/images/a1/radio.jpg'),
  'a1/television':   require('../../assets/images/a1/television.png'),
  'a1/map':          require('../../assets/images/a1/map.jpg'),
  // Food (extension)
  'a1/cake':         require('../../assets/images/a1/cake.png'),
  'a1/juice':        require('../../assets/images/a1/juice.png'),
  'a1/coffee':       require('../../assets/images/a1/coffee.png'),
  'a1/tea':          require('../../assets/images/a1/tea.png'),
  'a1/cheese':       require('../../assets/images/a1/cheese.png'),
  'a1/chicken':      require('../../assets/images/a1/chicken.png'),
  'a1/pizza':        require('../../assets/images/a1/pizza.png'),
  'a1/sandwich':     require('../../assets/images/a1/sandwich.png'),
  'a1/carrot':       require('../../assets/images/a1/carrot.png'),
  'a1/tomato':       require('../../assets/images/a1/tomato.jpg'),
  'a1/potato':       require('../../assets/images/a1/potato.jpg'),
  'a1/onion':        require('../../assets/images/a1/onion.jpg'),
  'a1/butter':       require('../../assets/images/a1/butter.jpg'),
  'a1/sugar':        require('../../assets/images/a1/sugar.jpg'),
  'a1/salt':         require('../../assets/images/a1/salt.png'),
  'a1/meat':         require('../../assets/images/a1/meat.jpg'),
  'a1/pasta':        require('../../assets/images/a1/pasta.jpg'),
  'a1/salad':        require('../../assets/images/a1/salad.jpg'),
  'a1/chocolate':    require('../../assets/images/a1/chocolate.jpg'),
  'a1/ice-cream':    require('../../assets/images/a1/ice-cream.jpg'),
  'a1/fruit':        require('../../assets/images/a1/fruit.jpg'),
  'a1/pepper':       require('../../assets/images/a1/pepper.png'),
  // Clothes
  'a1/hat':          require('../../assets/images/a1/hat.png'),
  'a1/coat':         require('../../assets/images/a1/coat.png'),
  'a1/dress':        require('../../assets/images/a1/dress.png'),
  'a1/shirt':        require('../../assets/images/a1/shirt.png'),
  'a1/shoe':         require('../../assets/images/a1/shoe.png'),
  'a1/jacket':       require('../../assets/images/a1/jacket.png'),
  'a1/skirt':        require('../../assets/images/a1/skirt.png'),
  'a1/jeans':        require('../../assets/images/a1/jeans.png'),
  'a1/tshirt':       require('../../assets/images/a1/tshirt.png'),
  'a1/sweater':      require('../../assets/images/a1/sweater.png'),
  'a1/trousers':     require('../../assets/images/a1/trousers.png'),
  'a1/boot':         require('../../assets/images/a1/boot.png'),
  // Emotions (extension)
  'a1/afraid':       require('../../assets/images/a1/afraid.png'),
  'a1/excited':      require('../../assets/images/a1/excited.png'),
  'a1/bored':        require('../../assets/images/a1/bored.png'),
  'a1/tired':        require('../../assets/images/a1/tired.png'),
  'a1/sick':         require('../../assets/images/a1/sick.png'),
  'a1/hungry':       require('../../assets/images/a1/hungry-dog.png'),
  'a1/thirsty':      require('../../assets/images/a1/thirsty.png'),
  // Time
  'a1/morning':      require('../../assets/images/a1/morning.png'),
  'a1/afternoon':    require('../../assets/images/a1/afternoon.png'),
  'a1/evening':      require('../../assets/images/a1/evening.png'),
  'a1/night':        require('../../assets/images/a1/night.png'),
  'a1/day':          require('../../assets/images/a1/day.png'),
  'a1/week':         require('../../assets/images/a1/week.png'),
  'a1/month':        require('../../assets/images/a1/month.png'),
  'a1/year':         require('../../assets/images/a1/year.png'),
  // Family (extension)
  'a1/friend':       require('../../assets/images/a1/friend.jpg'),
  'a1/son':          require('../../assets/images/a1/son.png'),
  'a1/daughter':     require('../../assets/images/a1/daughter.png'),
  'a1/husband':      require('../../assets/images/a1/husband.jpg'),
  'a1/wife':         require('../../assets/images/a1/wife.jpg'),
  // Adverbs (frequency & more)
  'a1/adv-always':   require('../../assets/images/a1/adv-always.jpg'),
  'a1/adv-never':    require('../../assets/images/a1/adv-never.jpg'),
  'a1/adv-often':    require('../../assets/images/a1/adv-often.jpg'),
  'a1/adv-sometimes':require('../../assets/images/a1/adv-sometimes.jpg'),
  'a1/adv-again':    require('../../assets/images/a1/adv-again.png'),
  'a1/adv-away':     require('../../assets/images/a1/adv-away.png'),
  'a1/adv-far':      require('../../assets/images/a1/adv-far.png'),
  'a1/adv-now':      require('../../assets/images/a1/adv-now.jpg'),
  // People (extension)
  'a1/child':        require('../../assets/images/a1/child.png'),
  'a1/teenager':     require('../../assets/images/a1/teenager.png'),
  'a1/adult':        require('../../assets/images/a1/adult.png'),
  'a1/person':       require('../../assets/images/a1/person.png'),
  'a1/neighbour':    require('../../assets/images/a1/neighbour.png'),
  // Family (extension 2)
  'a1/aunt':         require('../../assets/images/a1/aunt.png'),
  'a1/uncle':        require('../../assets/images/a1/uncle.png'),
  'a1/cousin':       require('../../assets/images/a1/cousin.png'),
  'a1/parent':       require('../../assets/images/a1/parent.png'),
  // Adverbs (extension 2)
  'a1/adv-usually':  require('../../assets/images/a1/adv-usually.png'),
  'a1/adv-really':   require('../../assets/images/a1/adv-really.png'),
  'a1/adv-also':     require('../../assets/images/a1/adv-also.png'),
  'a1/adv-maybe':    require('../../assets/images/a1/adv-maybe.png'),
  'a1/adv-well':     require('../../assets/images/a1/adv-well.png'),
  'a1/adv-upstairs': require('../../assets/images/a1/adv-upstairs.jpg'),
  'a1/adv-downstairs':require('../../assets/images/a1/adv-downstairs.jpg'),
  // Actions (extension)
  'a1/cook':         require('../../assets/images/a1/cook.jpg'),
  'a1/sing':         require('../../assets/images/a1/sing.jpg'),
  'a1/dance':        require('../../assets/images/a1/dance.jpg'),
  'a1/laugh':        require('../../assets/images/a1/laugh.jpg'),
  'a1/ride':         require('../../assets/images/a1/ride.jpg'),
  'a1/fly':          require('../../assets/images/a1/fly.jpg'),
  'a1/climb':        require('../../assets/images/a1/climb.jpg'),
  'a1/draw':         require('../../assets/images/a1/draw.jpg'),
  'a1/drive':        require('../../assets/images/a1/drive.jpg'),
  'a1/wash':         require('../../assets/images/a1/wash.jpg'),
  'a1/wear':         require('../../assets/images/a1/wear.jpg'),
  'a1/love':         require('../../assets/images/a1/love.jpg'),
  'a1/look':         require('../../assets/images/a1/look.jpg'),
  'a1/call':         require('../../assets/images/a1/call.jpg'),
  'a1/help':         require('../../assets/images/a1/help.jpg'),
  'a1/act-hate':     require('../../assets/images/a1/act-hate.png'),
  'a1/act-know':     require('../../assets/images/a1/act-know.png'),
  'a1/act-need':     require('../../assets/images/a1/act-need.png'),
  'a1/act-bring':    require('../../assets/images/a1/act-bring.png'),
  'a1/act-speak':    require('../../assets/images/a1/act-speak.jpg'),
  'a1/act-win':      require('../../assets/images/a1/act-win.png'),
  'a1/act-break':    require('../../assets/images/a1/act-break.png'),
  'a1/act-travel':   require('../../assets/images/a1/act-travel.png'),
  'a1/act-visit':    require('../../assets/images/a1/act-visit.png'),
  'a1/act-feel':     require('../../assets/images/a1/act-feel.jpg'),
  // Additional words (333-432)
  'a1/adj-soft':     require('../../assets/images/a1/adj-soft.jpg'),
  'a1/adj-empty':    require('../../assets/images/a1/adj-empty.png'),
  'a1/adj-bright':   require('../../assets/images/a1/adj-bright.png'),
  'a1/adj-heavy':    require('../../assets/images/a1/adj-heavy.png'),
  'a1/adj-light':    require('../../assets/images/a1/adj-light.png'),
  'a1/adj-wet':      require('../../assets/images/a1/adj-wet.png'),
  'a1/adj-dry':      require('../../assets/images/a1/adj-dry.png'),
  'a1/adj-cheap':    require('../../assets/images/a1/adj-cheap.png'),
  'a1/adj-expensive': require('../../assets/images/a1/adj-expensive.png'),
  'a1/adj-dangerous': require('../../assets/images/a1/adj-dangerous.png'),
  'a1/adj-safe':     require('../../assets/images/a1/adj-safe.png'),
  'a1/adj-rich':     require('../../assets/images/a1/adj-rich.png'),
  'a1/adj-poor':     require('../../assets/images/a1/adj-poor.png'),
  'a1/adj-lucky':    require('../../assets/images/a1/adj-lucky.png'),
  'a1/adj-ready':    require('../../assets/images/a1/adj-ready.png'),
  'a1/adj-late':     require('../../assets/images/a1/adj-late.png'),
  'a1/adj-early':    require('../../assets/images/a1/adj-early.png'),
  'a1/adj-right':    require('../../assets/images/a1/adj-right.png'),
  'a1/adj-wrong':    require('../../assets/images/a1/adj-wrong.png'),
  'a1/adj-easy':     require('../../assets/images/a1/adj-easy.png'),
  'a1/adj-difficult': require('../../assets/images/a1/adj-difficult.png'),
  'a1/adj-important': require('../../assets/images/a1/adj-important.png'),
  'a1/adj-interesting': require('../../assets/images/a1/adj-interesting.png'),
  'a1/adj-boring':   require('../../assets/images/a1/adj-boring.png'),
  'a1/adj-different': require('../../assets/images/a1/adj-different.png'),
  'a1/adj-same':     require('../../assets/images/a1/adj-same.png'),
  'a1/adj-special':  require('../../assets/images/a1/adj-special.png'),
  'a1/adj-favorite': require('../../assets/images/a1/adj-favorite.png'),
  'a1/adj-angry':    require('../../assets/images/a1/adj-angry.png'),
  'a1/adj-sweet':    require('../../assets/images/a1/adj-sweet.png'),
  'a1/adj-sour':     require('../../assets/images/a1/adj-sour.png'),
  'a1/adj-delicious': require('../../assets/images/a1/adj-delicious.png'),
  'a1/adj-fresh':    require('../../assets/images/a1/adj-fresh.png'),
  'a1/adj-angry-teacher': require('../../assets/images/a1/adj-angry-teacher.png'),
  'a1/adj-silly':    require('../../assets/images/a1/adj-silly.png'),
  'a1/adj-smart':    require('../../assets/images/a1/adj-smart.png'),
  'a1/adj-kind':     require('../../assets/images/a1/adj-kind.png'),
  'a1/adj-mean':     require('../../assets/images/a1/adj-mean.png'),
  'a1/adj-busy':     require('../../assets/images/a1/adj-busy.png'),
  'a1/adj-free':     require('../../assets/images/a1/adj-free.png'),
  'a1/adj-careful':  require('../../assets/images/a1/adj-careful.png'),
  'a1/adj-lazy':     require('../../assets/images/a1/adj-lazy.png'),
  'a1/adj-friendly': require('../../assets/images/a1/adj-friendly.png'),
  'a1/adj-shy':      require('../../assets/images/a1/adj-shy.png'),
  'a1/adj-brave':    require('../../assets/images/a1/adj-brave.png'),
  'a1/adj-proud':    require('../../assets/images/a1/adj-proud.png'),
  'a1/adj-worried':  require('../../assets/images/a1/adj-worried.png'),
  'a1/adj-surprised': require('../../assets/images/a1/adj-surprised.png'),
  'a1/adj-lonely':   require('../../assets/images/a1/adj-lonely.png'),
  'a1/adj-perfect':  require('../../assets/images/a1/adj-perfect.png'),
  'a1/adj-terrible': require('../../assets/images/a1/adj-terrible.png'),
  'a1/adj-wonderful': require('../../assets/images/a1/adj-wonderful.png'),
  'a1/adj-comfortable': require('../../assets/images/a1/adj-comfortable.png'),
  'a1/adj-narrow':   require('../../assets/images/a1/adj-narrow.png'),
  'a1/adj-wide':     require('../../assets/images/a1/adj-wide.png'),
  'a1/adj-thick':    require('../../assets/images/a1/adj-thick.png'),
  'a1/adj-thin':     require('../../assets/images/a1/adj-thin.png'),
  'a1/adj-round':    require('../../assets/images/a1/adj-round.png'),
  'a1/adj-square':   require('../../assets/images/a1/adj-square.png'),
  'a1/adj-straight': require('../../assets/images/a1/adj-straight.png'),
  'a1/adj-sharp':    require('../../assets/images/a1/adj-sharp.png'),
  'a1/adj-smooth':   require('../../assets/images/a1/adj-smooth.png'),
  'a1/adj-rough':    require('../../assets/images/a1/adj-rough.png'),
  'a1/adj-noisy':    require('../../assets/images/a1/adj-noisy.png'),
  'a1/adj-close':    require('../../assets/images/a1/adj-close.png'),
  'a1/adj-near':     require('../../assets/images/a1/adj-near.png'),
  'a1/adj-next':     require('../../assets/images/a1/adj-next.jpg'),
  'a1/adj-last':     require('../../assets/images/a1/adj-last.png'),
  'a1/adj-first':    require('../../assets/images/a1/adj-first.png'),
  'a1/adj-second':   require('../../assets/images/a1/adj-second.png'),
  'a1/act-slow':     require('../../assets/images/a1/act-slow.png'),
  'a1/act-hope':     require('../../assets/images/a1/act-hope.png'),
  'a1/act-wish':     require('../../assets/images/a1/act-wish.png'),
  'a1/act-remember': require('../../assets/images/a1/act-remember.png'),
  'a1/act-forget':   require('../../assets/images/a1/act-forget.png'),
  'a1/act-try':      require('../../assets/images/a1/act-try.png'),
  'a1/act-understand': require('../../assets/images/a1/act-understand.png'),
  'a1/act-believe':  require('../../assets/images/a1/act-believe.png'),
  'a1/act-choose':   require('../../assets/images/a1/act-choose.png'),
  'a1/act-change':   require('../../assets/images/a1/act-change.png'),
  'a1/act-turn':     require('../../assets/images/a1/act-turn.png'),
  'a1/act-move':     require('../../assets/images/a1/act-move.png'),
  'a1/act-carry':    require('../../assets/images/a1/act-carry.png'),
  'a1/act-hold':     require('../../assets/images/a1/act-hold.png'),
  'a1/act-catch':    require('../../assets/images/a1/act-catch.png'),
  'a1/act-throw':    require('../../assets/images/a1/act-throw.png'),
  'a1/act-pull':     require('../../assets/images/a1/act-pull.png'),
  'a1/act-push':     require('../../assets/images/a1/act-push.png'),
  'a1/act-cut':      require('../../assets/images/a1/act-cut.png'),
  'a1/act-touch':    require('../../assets/images/a1/act-touch.png'),
  'a1/act-kiss':     require('../../assets/images/a1/act-kiss.png'),
  'a1/act-hug':      require('../../assets/images/a1/act-hug.png'),
  'a1/act-smile':    require('../../assets/images/a1/act-smile.png'),
  'a1/act-cry':      require('../../assets/images/a1/act-cry.png'),
  'a1/act-shout':    require('../../assets/images/a1/act-shout.png'),
  'a1/act-whisper':  require('../../assets/images/a1/act-whisper.png'),
  'a1/act-answer':   require('../../assets/images/a1/act-answer.png'),
  'a1/act-show':     require('../../assets/images/a1/act-show.png'),
  'a1/act-explain':  require('../../assets/images/a1/act-explain.png'),
  'a1/act-teach':    require('../../assets/images/a1/act-teach.png'),
  // ── new A1 batch · greetings (placeholder, TODO photo) ──
  'a1/greet-hello': require('../../assets/images/a1/greet-hello.png'),
  'a1/greet-goodbye': require('../../assets/images/a1/placeholder.png'), // TODO photo: The friends hug and say goodbye at the airport.
  'a1/greet-please': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy says please and gets more cake.
  'a1/greet-thanks': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl smiles and says thanks for the flowers.
  'a1/greet-sorry': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy drops a glass and says sorry.
  'a1/greet-yes': require('../../assets/images/a1/placeholder.png'), // TODO photo: Yes! The baby wants more ice cream.
  'a1/greet-no': require('../../assets/images/a1/placeholder.png'), // TODO photo: No! The cat does not like the bath.
  'a1/greet-welcome': require('../../assets/images/a1/placeholder.png'), // TODO photo: The mat at the front door says welcome.
  // ── new A1 batch · pronouns (placeholder, TODO photo) ──
  'a1/pron-i': require('../../assets/images/a1/placeholder.png'), // TODO photo: I am taking a photo of the sea.
  'a1/pron-you': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl points at the camera and says: You!
  'a1/pron-he': require('../../assets/images/a1/placeholder.png'), // TODO photo: He is standing in the rain with a big umbrella.
  'a1/pron-she': require('../../assets/images/a1/placeholder.png'), // TODO photo: She plays the piano every evening.
  'a1/pron-it': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is sleeping on the bed.
  'a1/pron-we': require('../../assets/images/a1/placeholder.png'), // TODO photo: We love the sea!
  'a1/pron-they': require('../../assets/images/a1/placeholder.png'), // TODO photo: They ride their bikes to school.
  'a1/pron-my': require('../../assets/images/a1/placeholder.png'), // TODO photo: This is my ball!
  'a1/pron-your': require('../../assets/images/a1/placeholder.png'), // TODO photo: This is your present!
  'a1/pron-his': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is his hat.
  'a1/pron-her': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is her bag.
  'a1/pron-our': require('../../assets/images/a1/placeholder.png'), // TODO photo: This is our new house!
  'a1/pron-their': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is their dog.
  // ── new A1 batch · questions (placeholder, TODO photo) ──
  'a1/q-what': require('../../assets/images/a1/placeholder.png'), // TODO photo: What is in the box?
  'a1/q-where': require('../../assets/images/a1/placeholder.png'), // TODO photo: Where is my ball?
  'a1/q-who': require('../../assets/images/a1/placeholder.png'), // TODO photo: Who is at the door?
  'a1/q-when': require('../../assets/images/a1/placeholder.png'), // TODO photo: When does the train come?
  'a1/q-why': require('../../assets/images/a1/placeholder.png'), // TODO photo: Why is the baby crying?
  'a1/q-how': require('../../assets/images/a1/placeholder.png'), // TODO photo: How old are you?
  // ── new A1 batch · prepositions (placeholder, TODO photo) ──
  'a1/prep-in': require('../../assets/images/a1/placeholder.png'), // TODO photo: The cat is in the box.
  'a1/prep-on': require('../../assets/images/a1/placeholder.png'), // TODO photo: The cat is sleeping on the sofa.
  'a1/prep-under': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy is hiding under the table.
  'a1/prep-behind': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl is hiding behind a big tree.
  'a1/prep-between': require('../../assets/images/a1/placeholder.png'), // TODO photo: The dog sits between the boy and the girl.
  'a1/prep-next-to': require('../../assets/images/a1/placeholder.png'), // TODO photo: The cafe is next to the bank.
  'a1/prep-in-front-of': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children stand in front of the school.
  'a1/prep-above': require('../../assets/images/a1/placeholder.png'), // TODO photo: The plane flies above the clouds.
  'a1/prep-around': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children dance around the tree.
  'a1/prep-through': require('../../assets/images/a1/placeholder.png'), // TODO photo: The train goes through a dark tunnel.
  'a1/prep-across': require('../../assets/images/a1/placeholder.png'), // TODO photo: The mother and her boy walk across the road.
  'a1/prep-with': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy eats his soup with a big spoon.
  'a1/prep-without': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl goes out without an umbrella. Now she is wet!
  // ── new A1 batch · actions (placeholder, TODO photo) ──
  'a1/act-have': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl has a big red balloon.
  'a1/act-like': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy likes pizza. It is his favorite food!
  'a1/act-want': require('../../assets/images/a1/placeholder.png'), // TODO photo: The baby wants the cake!
  'a1/act-get': require('../../assets/images/a1/placeholder.png'), // TODO photo: The woman gets a letter from her friend.
  'a1/act-live': require('../../assets/images/a1/placeholder.png'), // TODO photo: Fish live in the sea.
  'a1/act-study': require('../../assets/images/a1/placeholder.png'), // TODO photo: The student studies for the exam.
  'a1/act-use': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl uses her phone to take a photo.
  'a1/act-tell': require('../../assets/images/a1/placeholder.png'), // TODO photo: Grandpa tells a funny story.
  'a1/act-keep': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl keeps her treasures in a box.
  'a1/act-send': require('../../assets/images/a1/placeholder.png'), // TODO photo: The man sends a letter to his son.
  'a1/act-enjoy': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl enjoys the beach.
  'a1/act-finish': require('../../assets/images/a1/placeholder.png'), // TODO photo: The runner finishes the race.
  'a1/act-join': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy joins the football game.
  'a1/act-build': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children build a big sand castle.
  'a1/act-grow': require('../../assets/images/a1/placeholder.png'), // TODO photo: The flowers grow in the garden.
  'a1/act-follow': require('../../assets/images/a1/placeholder.png'), // TODO photo: The little ducks follow their mother.
  'a1/act-guess': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children guess what is in the box.
  'a1/act-paint': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl paints the wall blue.
  'a1/act-relax': require('../../assets/images/a1/placeholder.png'), // TODO photo: The man relaxes on the sofa.
  'a1/act-repeat': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children repeat the new word.
  'a1/act-return': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy returns his book to the library.
  'a1/act-order': require('../../assets/images/a1/placeholder.png'), // TODO photo: The woman orders a pizza.
  'a1/act-lose': require('../../assets/images/a1/placeholder.png'), // TODO photo: The team loses the game.
  'a1/act-fix': require('../../assets/images/a1/placeholder.png'), // TODO photo: The man fixes the bike.
  // ── new A1 batch · numbers (placeholder, TODO photo) ──
  'a1/num-eleven': require('../../assets/images/a1/placeholder.png'), // TODO photo: A football team has eleven players on the field.
  'a1/num-twelve': require('../../assets/images/a1/placeholder.png'), // TODO photo: Twelve eggs are in the box.
  'a1/num-thirteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy is thirteen today.
  'a1/num-fourteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: Two weeks is fourteen days.
  'a1/num-fifteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: Fifteen colorful balls are on the pool table.
  'a1/num-sixteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: The big cake has sixteen candles.
  'a1/num-seventeen': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl is seventeen and she goes to school by bike.
  'a1/num-eighteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: He is eighteen and he has his first car.
  'a1/num-nineteen': require('../../assets/images/a1/placeholder.png'), // TODO photo: Nineteen people wait for the bus in the rain.
  'a1/num-twenty': require('../../assets/images/a1/placeholder.png'), // TODO photo: We have twenty fingers and toes.
  'a1/num-thirty': require('../../assets/images/a1/placeholder.png'), // TODO photo: Thirty students sit in the classroom.
  'a1/num-forty': require('../../assets/images/a1/placeholder.png'), // TODO photo: Forty people watch a film at the cinema.
  'a1/num-fifty': require('../../assets/images/a1/placeholder.png'), // TODO photo: She is fifty today. Her friends bring a big cake.
  'a1/num-sixty': require('../../assets/images/a1/placeholder.png'), // TODO photo: One hour has sixty minutes.
  'a1/num-seventy': require('../../assets/images/a1/placeholder.png'), // TODO photo: The man with the white hat is seventy years old.
  'a1/num-eighty': require('../../assets/images/a1/placeholder.png'), // TODO photo: Grandma is eighty, but she still dances!
  'a1/num-ninety': require('../../assets/images/a1/placeholder.png'), // TODO photo: Grandpa is ninety and he has a very big party.
  'a1/num-hundred': require('../../assets/images/a1/placeholder.png'), // TODO photo: A hundred balloons fly in the sky.
  'a1/num-thousand': require('../../assets/images/a1/placeholder.png'), // TODO photo: We can see a thousand stars in the night sky.
  // ── new A1 batch · days (placeholder, TODO photo) ──
  'a1/day-monday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Monday morning, the tired boy goes to school.
  'a1/day-tuesday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Tuesday, the children eat pizza at school.
  'a1/day-wednesday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Wednesday, the girl plays the piano.
  'a1/day-thursday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Thursday, Mother buys fresh vegetables at the market.
  'a1/day-friday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Friday night, the friends watch a film.
  'a1/day-saturday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Saturday, the family goes to the beach.
  'a1/day-sunday': require('../../assets/images/a1/placeholder.png'), // TODO photo: On Sunday, Grandma cooks a big dinner.
  // ── new A1 batch · months (placeholder, TODO photo) ──
  'a1/month-january': require('../../assets/images/a1/placeholder.png'), // TODO photo: In January, the snow is deep and the new year begins.
  'a1/month-february': require('../../assets/images/a1/placeholder.png'), // TODO photo: In February, the boy gives chocolate to the girl.
  'a1/month-march': require('../../assets/images/a1/placeholder.png'), // TODO photo: In March, the first flowers come out.
  'a1/month-april': require('../../assets/images/a1/placeholder.png'), // TODO photo: In April, the girl runs in the rain with her umbrella.
  'a1/month-may': require('../../assets/images/a1/placeholder.png'), // TODO photo: In May, the garden is full of flowers.
  'a1/month-june': require('../../assets/images/a1/placeholder.png'), // TODO photo: In June, school is over and the children swim.
  'a1/month-july': require('../../assets/images/a1/placeholder.png'), // TODO photo: In July, the family eats ice cream on the hot beach.
  'a1/month-august': require('../../assets/images/a1/placeholder.png'), // TODO photo: In August, the family goes on holiday.
  'a1/month-september': require('../../assets/images/a1/placeholder.png'), // TODO photo: In September, the children go back to school.
  'a1/month-october': require('../../assets/images/a1/placeholder.png'), // TODO photo: In October, the leaves are orange and the pumpkins are big.
  'a1/month-november': require('../../assets/images/a1/placeholder.png'), // TODO photo: In November, it is dark and rainy in the evening.
  'a1/month-december': require('../../assets/images/a1/placeholder.png'), // TODO photo: In December, the family has a tree with lights and many presents.
  // ── new A1 batch · time (placeholder, TODO photo) ──
  'a1/time-today': require('../../assets/images/a1/placeholder.png'), // TODO photo: The party is today!
  'a1/time-tomorrow': require('../../assets/images/a1/placeholder.png'), // TODO photo: We go to the beach tomorrow!
  'a1/time-yesterday': require('../../assets/images/a1/placeholder.png'), // TODO photo: There was a big storm yesterday.
  'a1/time-weekend': require('../../assets/images/a1/placeholder.png'), // TODO photo: On the weekend, the family rides bikes.
  'a1/time-hour': require('../../assets/images/a1/placeholder.png'), // TODO photo: The bus comes every hour.
  'a1/time-minute': require('../../assets/images/a1/placeholder.png'), // TODO photo: Wait one minute, please!
  'a1/time-midnight': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is midnight and the city sleeps.
  'a1/time-birthday': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is her birthday!
  'a1/time-party': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children dance at the party.
  'a1/time-holiday': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family is on holiday by the sea.
  // ── new A1 batch · home (placeholder, TODO photo) ──
  'a1/home-home': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy runs home after school.
  'a1/home-kitchen': require('../../assets/images/a1/placeholder.png'), // TODO photo: Father cooks soup in the kitchen.
  'a1/home-bathroom': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy washes his face in the bathroom.
  'a1/home-bedroom': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl reads a book in her bedroom.
  'a1/home-floor': require('../../assets/images/a1/placeholder.png'), // TODO photo: The baby plays on the floor.
  'a1/home-wall': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy draws a picture on the wall!
  'a1/home-stairs': require('../../assets/images/a1/placeholder.png'), // TODO photo: The cat runs down the stairs.
  'a1/home-roof': require('../../assets/images/a1/placeholder.png'), // TODO photo: A bird sits on the roof of the house.
  'a1/home-apartment': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family lives in a small apartment in the city.
  // ── new A1 batch · school (placeholder, TODO photo) ──
  'a1/school-classroom': require('../../assets/images/a1/placeholder.png'), // TODO photo: The students sit in the classroom.
  'a1/school-lesson': require('../../assets/images/a1/placeholder.png'), // TODO photo: The English lesson starts now.
  'a1/school-homework': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl does her homework at the desk.
  'a1/school-question': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl has a question for the teacher.
  'a1/school-word': require('../../assets/images/a1/placeholder.png'), // TODO photo: The teacher writes a new word on the board.
  'a1/school-letter': require('../../assets/images/a1/placeholder.png'), // TODO photo: The old man reads a letter from his son.
  'a1/school-page': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy turns the page.
  'a1/school-picture': require('../../assets/images/a1/placeholder.png'), // TODO photo: The child shows his picture to the teacher.
  'a1/school-story': require('../../assets/images/a1/placeholder.png'), // TODO photo: Grandma reads a story to the children before bed.
  'a1/school-test': require('../../assets/images/a1/placeholder.png'), // TODO photo: The students are quiet during the test.
  'a1/school-dictionary': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy looks for a word in the dictionary.
  // ── new A1 batch · money (placeholder, TODO photo) ──
  'a1/money-money': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl puts her money in a pig bank.
  'a1/money-price': require('../../assets/images/a1/placeholder.png'), // TODO photo: The woman looks at the price of the shoes.
  'a1/money-ticket': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy shows his ticket at the cinema.
  'a1/money-shopping': require('../../assets/images/a1/placeholder.png'), // TODO photo: The mother goes shopping with a big bag.
  'a1/money-supermarket': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family buys food in the supermarket.
  'a1/money-pay': require('../../assets/images/a1/placeholder.png'), // TODO photo: The man pays for his coffee.
  // ── new A1 batch · hobbies (placeholder, TODO photo) ──
  'a1/hobby-music': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl listens to music on the bus.
  'a1/hobby-song': require('../../assets/images/a1/placeholder.png'), // TODO photo: The singer sings a happy song.
  'a1/hobby-sport': require('../../assets/images/a1/placeholder.png'), // TODO photo: Swimming is a good sport for kids.
  'a1/hobby-football': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boys play football in the park.
  'a1/hobby-tennis': require('../../assets/images/a1/placeholder.png'), // TODO photo: She plays tennis on a sunny day.
  'a1/hobby-game': require('../../assets/images/a1/placeholder.png'), // TODO photo: The friends play a board game after dinner.
  'a1/hobby-hobby': require('../../assets/images/a1/placeholder.png'), // TODO photo: Painting is her favorite hobby.
  'a1/hobby-film': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family watches a funny film.
  'a1/hobby-concert': require('../../assets/images/a1/placeholder.png'), // TODO photo: The singer and the guitar player are at a big concert.
  'a1/hobby-team': require('../../assets/images/a1/placeholder.png'), // TODO photo: The team is happy because they win.
  // ── new A1 batch · jobs (placeholder, TODO photo) ──
  'a1/job-artist': require('../../assets/images/a1/placeholder.png'), // TODO photo: The artist paints a picture of the sea.
  'a1/job-actor': require('../../assets/images/a1/placeholder.png'), // TODO photo: The actor is on the big stage.
  'a1/job-dancer': require('../../assets/images/a1/placeholder.png'), // TODO photo: The dancer jumps and turns on the stage.
  'a1/job-tourist': require('../../assets/images/a1/placeholder.png'), // TODO photo: The tourist takes photos of the old street.
  'a1/job-player': require('../../assets/images/a1/placeholder.png'), // TODO photo: The player runs with the ball.
  'a1/job-scientist': require('../../assets/images/a1/placeholder.png'), // TODO photo: The scientist looks at a tiny plant.
  'a1/job-customer': require('../../assets/images/a1/placeholder.png'), // TODO photo: The waiter smiles at the customer.
  // ── new A1 batch · people (placeholder, TODO photo) ──
  'a1/people-family': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family has a picnic in the park.
  'a1/people-name': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy writes his name on the bag.
  'a1/people-job': require('../../assets/images/a1/placeholder.png'), // TODO photo: The nurse loves her job.
  // ── new A1 batch · food (placeholder, TODO photo) ──
  'a1/food-breakfast': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family eats eggs and bread for breakfast.
  'a1/food-lunch': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children eat lunch at school.
  'a1/food-dinner': require('../../assets/images/a1/placeholder.png'), // TODO photo: Grandma cooks dinner for everyone.
  'a1/food-vegetable': require('../../assets/images/a1/placeholder.png'), // TODO photo: A carrot is a vegetable.
  'a1/food-menu': require('../../assets/images/a1/placeholder.png'), // TODO photo: The waiter gives the menu to the guests.
  'a1/food-cream': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl puts cream on the cake.
  'a1/food-food': require('../../assets/images/a1/placeholder.png'), // TODO photo: There is a lot of food on the table.
  // ── new A1 batch · places (placeholder, TODO photo) ──
  'a1/place-pool': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children swim in the pool.
  'a1/place-gym': require('../../assets/images/a1/placeholder.png'), // TODO photo: The woman gets strong in the gym.
  'a1/place-theatre': require('../../assets/images/a1/placeholder.png'), // TODO photo: The family watches a show at the theatre.
  'a1/place-building': require('../../assets/images/a1/placeholder.png'), // TODO photo: The tall building has a hundred windows.
  'a1/place-university': require('../../assets/images/a1/placeholder.png'), // TODO photo: The young woman studies at the university.
  'a1/place-world': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy looks at the world on a globe.
  // ── new A1 batch · objects (placeholder, TODO photo) ──
  'a1/obj-newspaper': require('../../assets/images/a1/placeholder.png'), // TODO photo: The old man reads the newspaper with his coffee.
  'a1/obj-magazine': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl reads a magazine at the cafe.
  'a1/obj-passport': require('../../assets/images/a1/placeholder.png'), // TODO photo: The woman shows her passport at the airport.
  'a1/obj-message': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl sends a message to her friend.
  'a1/obj-card': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy makes a birthday card for his mother.
  'a1/obj-present': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl gets a big present.
  'a1/obj-paper': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl folds paper into a small boat.
  // ── new A1 batch · body (placeholder, TODO photo) ──
  'a1/body-finger': require('../../assets/images/a1/placeholder.png'), // TODO photo: The baby holds his mother's finger.
  'a1/body-knee': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy fell and hurt his knee.
  'a1/body-neck': require('../../assets/images/a1/placeholder.png'), // TODO photo: The giraffe has a very long neck.
  'a1/body-shoulder': require('../../assets/images/a1/placeholder.png'), // TODO photo: The parrot sits on the pirate's shoulder.
  'a1/body-stomach': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy is hungry and his stomach is loud.
  'a1/body-toe': require('../../assets/images/a1/placeholder.png'), // TODO photo: The baby plays with her toes.
  // ── new A1 batch · animals (placeholder, TODO photo) ──
  'a1/animal-duck': require('../../assets/images/a1/placeholder.png'), // TODO photo: The duck swims in the pond with her babies.
  'a1/animal-frog': require('../../assets/images/a1/placeholder.png'), // TODO photo: The green frog jumps on a big leaf.
  'a1/animal-monkey': require('../../assets/images/a1/placeholder.png'), // TODO photo: The monkey eats a banana in the tree.
  'a1/animal-giraffe': require('../../assets/images/a1/placeholder.png'), // TODO photo: The giraffe eats leaves from the tall tree.
  'a1/animal-butterfly': require('../../assets/images/a1/placeholder.png'), // TODO photo: A butterfly sits on a yellow flower.
  'a1/animal-tiger': require('../../assets/images/a1/placeholder.png'), // TODO photo: The tiger walks in the tall grass.
  // ── new A1 batch · nature (placeholder, TODO photo) ──
  'a1/nature-sky': require('../../assets/images/a1/placeholder.png'), // TODO photo: The birds fly in the blue sky.
  'a1/nature-moon': require('../../assets/images/a1/placeholder.png'), // TODO photo: The moon is big and bright tonight.
  'a1/nature-star': require('../../assets/images/a1/placeholder.png'), // TODO photo: A star twinkles in the dark sky.
  'a1/nature-grass': require('../../assets/images/a1/placeholder.png'), // TODO photo: The cows eat green grass.
  'a1/nature-leaf': require('../../assets/images/a1/placeholder.png'), // TODO photo: A yellow leaf falls from the tree.
  'a1/nature-forest': require('../../assets/images/a1/placeholder.png'), // TODO photo: The bear walks in the dark forest.
  'a1/nature-lake': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy sits in a boat on the quiet lake.
  // ── new A1 batch · weather (placeholder, TODO photo) ──
  'a1/weather-weather': require('../../assets/images/a1/placeholder.png'), // TODO photo: The weather is great today.
  'a1/weather-sunny': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is a sunny day at the beach.
  'a1/weather-cloudy': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is cloudy and grey over the city.
  'a1/weather-windy': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is very windy and the girl holds her hat.
  'a1/weather-rainy': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is a rainy day in the city.
  'a1/weather-snowy': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is snowy and the children play in the garden.
  'a1/weather-foggy': require('../../assets/images/a1/placeholder.png'), // TODO photo: It is foggy and we cannot see the road.
  'a1/weather-storm': require('../../assets/images/a1/placeholder.png'), // TODO photo: A big storm comes over the sea.
  // ── new A1 batch · adjectives (placeholder, TODO photo) ──
  'a1/adj-high': require('../../assets/images/a1/placeholder.png'), // TODO photo: The tree is very high.
  'a1/adj-deep': require('../../assets/images/a1/placeholder.png'), // TODO photo: The well is very deep.
  'a1/adj-huge': require('../../assets/images/a1/placeholder.png'), // TODO photo: The elephant is huge!
  'a1/adj-tiny': require('../../assets/images/a1/placeholder.png'), // TODO photo: The ant is tiny on her finger.
  'a1/adj-cool': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy looks really cool.
  'a1/adj-famous': require('../../assets/images/a1/placeholder.png'), // TODO photo: The singer is famous and everyone takes photos.
  'a1/adj-modern': require('../../assets/images/a1/placeholder.png'), // TODO photo: The house is very modern.
  'a1/adj-amazing': require('../../assets/images/a1/placeholder.png'), // TODO photo: The fireworks are amazing!
  'a1/adj-exciting': require('../../assets/images/a1/placeholder.png'), // TODO photo: The ride is very exciting.
  'a1/adj-pretty': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl in the yellow dress is pretty.
  'a1/adj-blonde': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl has long blonde hair.
  // ── new A1 batch · adverbs (placeholder, TODO photo) ──
  'a1/adv-up': require('../../assets/images/a1/placeholder.png'), // TODO photo: The balloon flies up into the sky.
  'a1/adv-down': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy goes down the slide.
  'a1/adv-here': require('../../assets/images/a1/placeholder.png'), // TODO photo: Come here, little dog!
  'a1/adv-there': require('../../assets/images/a1/placeholder.png'), // TODO photo: Look, the bird is over there!
  'a1/adv-back': require('../../assets/images/a1/placeholder.png'), // TODO photo: The dog brings the ball back.
  'a1/adv-left': require('../../assets/images/a1/placeholder.png'), // TODO photo: Turn left at the bank.
  'a1/adv-very': require('../../assets/images/a1/placeholder.png'), // TODO photo: The elephant is very big.
  'a1/adv-too': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy eats ice cream, and his sister eats ice cream too.
  'a1/adv-slowly': require('../../assets/images/a1/placeholder.png'), // TODO photo: The snail moves slowly across the leaf.
  // ── new A1 batch · clothes (placeholder, TODO photo) ──
  'a1/clothes-scarf': require('../../assets/images/a1/placeholder.png'), // TODO photo: The girl wears a warm red scarf.
  'a1/clothes-socks': require('../../assets/images/a1/placeholder.png'), // TODO photo: The boy puts on his socks and shoes.
  'a1/clothes-shorts': require('../../assets/images/a1/placeholder.png'), // TODO photo: The children wear shorts and T-shirts on the beach.
};

/** Resolve a bundled image key, or undefined for an unknown/remote key. */
export function getImage(key: string | null): ImageSourcePropType | undefined {
  if (!key) return undefined;
  return registry[key];
}

export default registry;
