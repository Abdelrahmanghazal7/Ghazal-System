$(document).ready(function () {

  const gameContainer = $(".container"),
    userResult = $(".user_result img"),
    cpuResult = $(".cpu_result img"),
    result = $(".result"),
    optionImages = $(".option_image");

  optionImages.on("click", function () {
    const clickedImage = $(this);
    const index = optionImages.index(clickedImage);

    clickedImage.addClass("active");

    userResult.attr("src", "images/rock.png");
    cpuResult.attr("src", "images/rock.png");
    result.text("Wait...");

    optionImages.each(function (index2, image2) {
      const currentImage = $(image2);

      if (index !== index2) {
        currentImage.removeClass("active");
      }
    });

    gameContainer.addClass("start");

    setTimeout(function () {
      gameContainer.removeClass("start");

      let imageSrc = clickedImage.find("img").attr("src");

      userResult.attr("src", imageSrc);

      let randomNumber = Math.floor(Math.random() * 3);

      let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];

      cpuResult.attr("src", cpuImages[randomNumber]);

      let cpuValue = ["R", "P", "S"][randomNumber];

      let userValue = ["R", "P", "S"][index];

      let outcomes = {
        RR: "Draw",
        RP: "Cpu",
        RS: "User",
        PP: "Draw",
        PR: "User",
        PS: "Cpu",
        SS: "Draw",
        SR: "Cpu",
        SP: "User",
      };

      let outComeValue = outcomes[userValue + cpuValue];

      result.text(userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`);
    }, 2500);
  });
});

// L O A D E R

$(document).ready(function () {
  setTimeout(function () {
    $("#loading-spinner").css("display", "none");
  }, 2000);
});
