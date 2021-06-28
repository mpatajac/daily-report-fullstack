import { Component, OnInit, OnDestroy } from '@angular/core';
import gsap from "gsap";

@Component({
  selector: 'app-report-improper-format',
  templateUrl: './report-improper-format.component.html',
  styleUrls: ['./report-improper-format.component.scss']
})
export class ReportImproperFormatComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit(): void {
    // run animation only on desktop
		if (window.innerWidth > 1200 && window.innerHeight >= 768) {
			// remove overflow from body
			document.getElementsByTagName("body")[0].style.overflow = "hidden";

			// wait for everything to load before starting the animation
			setTimeout(this.initAnimation, 0);
    }

		// on small screens, remove the gap between spans inside <h3>
		if (window.innerWidth < 424) {
			const extraSpace = document.getElementsByTagName("h3")[0].childNodes[1];
			extraSpace.parentNode.removeChild(extraSpace);
		}
  }

	ngOnDestroy(): void {
		// bring back overflow to body
		document.getElementsByTagName("body")[0].style.overflow = "initial";
	}

  initAnimation() {
		const reportExampleTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
      yoyo: false,
      defaults: {
        duration: .5,
        delay: 1,
        stagger: .2,
        transformOrigin: "0% 50%"
      }
    });

    const captionsTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
      yoyo: false,
      defaults: {
        duration: .5,
        delay: .5
      }
    });


    /// reportExampleTimeline
    reportExampleTimeline
      // zoom editor
      .to("#rpf-svg", { duration: 1, delay: 2, transformOrigin: "top left", scale: 1.5 })

      // show report title
      .to("#rpf-title", { opacity: 1 })

      // show 'done' component title
      .to("#rpf-done-title", { opacity: 1 }, "+=5")

      // slide editor
      .to("#rpf-editor", { duration: .5, delay: 2, yPercent: -4, transformOrigin: "0% 0%" })

      // show 'done' component items
      .to(".rpf-done-item", { opacity: 1 }, "+=2")

      // show 'in progress' (total)
      .to(".rpf-inprogress", { opacity: 1 }, "+=2.5")

      // slide editor
      .to("#rpf-editor", { duration: .5, delay: 2, yPercent: -12, transformOrigin: "0% 0%" }, "+=.5")

      // show 'scheduled' component title
      .to("#rpf-scheduled-title", { opacity: 1 }, "+=1")

      // show 'problems' (total)
      .to(".rpf-problems", { opacity: 1 }, "+=3")

      // display full report
      .to("#rpf-svg", { duration: .5, delay: 2, yPercent: 0, transformOrigin: "top left", scale: 1 }, "reset")
			.to("#rpf-editor", { duration: .5, delay: 2, yPercent: 0, transformOrigin: "top left"}, "reset")

      // fade text out
      .to(".rpf-text", { duration: .5, delay: 2, opacity: 0, stagger: 0 }, "+=.2");


    /// captionsTimeline
    captionsTimeline
      .to(`#rpf-caption-1`, { opacity: 1 }, "+=2.5")
      .to(`#rpf-caption-1`, { opacity: 0 }, "+=3")

    for (let i = 2; i < 6; ++i) {
      captionsTimeline
        .to(`#rpf-caption-${i}`, { opacity: 1 }, "+=.5")
        .to(`#rpf-caption-${i}`, { opacity: 0 }, "+=3")
    }

    captionsTimeline
      .to("#rpf-caption-6", { opacity: 1 }, "+=.5")
      .to("#rpf-caption-6", { opacity: 0 }, "+=5")
  }
}
