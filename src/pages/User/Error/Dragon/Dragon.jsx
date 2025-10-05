import React, { useEffect, useRef } from "react";

const ElectricCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const dist = (p1x, p1y, p2x, p2y) =>
      Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));

    class Segment {
      constructor(parent, l, a, first) {
        this.first = first;
        this.l = l;
        this.ang = a;
        this.pos = first
          ? { x: parent.x, y: parent.y }
          : { x: parent.nextPos.x, y: parent.nextPos.y };
        this.nextPos = {
          x: this.pos.x + this.l * Math.cos(this.ang),
          y: this.pos.y + this.l * Math.sin(this.ang),
        };
      }

      update(t) {
        this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
        this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
        this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
      }

      fallback(t) {
        this.pos.x = t.x;
        this.pos.y = t.y;
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
      }

      show() {
        c.lineTo(this.nextPos.x, this.nextPos.y);
      }
    }

    class Tentacle {
      constructor(x, y, l, n) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.n = n;
        this.rand = Math.random();
        this.segments = [new Segment(this, this.l / this.n, 0, true)];
        for (let i = 1; i < this.n; i++) {
          this.segments.push(
            new Segment(this.segments[i - 1], this.l / this.n, 0, false)
          );
        }
      }

      move(last_target, target) {
        const angle = Math.atan2(target.y - this.y, target.x - this.x);
        const dt = dist(last_target.x, last_target.y, target.x, target.y) + 5;
        const t = {
          x: target.x - 0.8 * dt * Math.cos(angle),
          y: target.y - 0.8 * dt * Math.sin(angle),
        };
        this.segments[this.n - 1].update(t.x ? t : target);
        for (let i = this.n - 2; i >= 0; i--) {
          this.segments[i].update(this.segments[i + 1].pos);
        }
        if (
          dist(this.x, this.y, target.x, target.y) <=
          this.l + dist(last_target.x, last_target.y, target.x, target.y)
        ) {
          this.segments[0].fallback({ x: this.x, y: this.y });
          for (let i = 1; i < this.n; i++) {
            this.segments[i].fallback(this.segments[i - 1].nextPos);
          }
        }
      }

      show(target) {
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c.globalCompositeOperation = "lighter";
          c.beginPath();
          c.lineTo(this.x, this.y);
          for (let i = 0; i < this.n; i++) this.segments[i].show();
          c.strokeStyle = `hsl(${this.rand * 60 + 180},100%,${
            this.rand * 60 + 25
          }%)`;
          c.lineWidth = this.rand * 2;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.stroke();
          c.globalCompositeOperation = "source-over";
        }
      }

      show2(target) {
        c.beginPath();
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
          c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
          c.fillStyle = "white";
        } else {
          c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
          c.fillStyle = "darkcyan";
        }
        c.fill();
      }
    }

    const maxl = 300,
      minl = 50,
      n = 30,
      numt = 500;
    const tent = [];
    const mouse = { x: false, y: false };
    const last_mouse = {};
    const target = { x: 0, y: 0 };
    const last_target = {};
    let t = 0;
    const q = 10;

    for (let i = 0; i < numt; i++) {
      tent.push(
        new Tentacle(
          Math.random() * w,
          Math.random() * h,
          Math.random() * (maxl - minl) + minl,
          n
        )
      );
    }

    const draw = () => {
      if (mouse.x) {
        target.errx = mouse.x - target.x;
        target.erry = mouse.y - target.y;
      } else {
        target.errx =
          w / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
          target.x;
        target.erry =
          h / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
          target.y;
      }

      target.x += target.errx / 10;
      target.y += target.erry / 10;

      t += 0.01;

      c.beginPath();
      c.arc(
        target.x,
        target.y,
        dist(last_target.x, last_target.y, target.x, target.y) + 5,
        0,
        2 * Math.PI
      );
      c.fillStyle = "hsl(210,100%,80%)";
      c.fill();

      for (let i = 0; i < numt; i++) tent[i].move(last_target, target);
      for (let i = 0; i < numt; i++) tent[i].show2(target);
      for (let i = 0; i < numt; i++) tent[i].show(target);

      last_target.x = target.x;
      last_target.y = target.y;
    };

    const loop = () => {
      c.clearRect(0, 0, w, h);
      draw();
      requestAnimationFrame(loop);
    };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e) => {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;
      mouse.x = e.pageX;
      mouse.y = e.pageY;
    };

    const onMouseLeave = () => {
      mouse.x = false;
      mouse.y = false;
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "black",
        width: "100vw",
        height: "100vh",
        zIndex: 1,
      }}
    ></canvas>
  );
};

export default ElectricCursor;
