import { Router, Request, Response } from "express";
import { NextFunction } from "connect";
const router = Router();

function requireAuth(req: Request, res: Response, next: NextFunction): void {
	if (req.session && req.session.loggedIn) {
		return next();
	}
	res.status(403);
	res.send("Not permitted.");
}

router.get("/login", (req: Request, res: Response) => {
	res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email" />
      </div>
      <div>
        <label>Password</label>
        <input name="password" type="password" />
      </div>
      <button>Submit</button>
    </form>
  `);
});

router.post("/login", (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (email && password && email === "hi@hi.com" && password === "password") {
		// Mark this person as logged in
		req.session = { loggedIn: true };
		res.redirect("/");
	} else {
		res.send("You must provide an email.");
	}
});

router.get("/", (req: Request, res: Response) => {
	if (req.session && req.session.loggedIn) {
		res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/logout">Logout</a>
      </div>
    `);
	} else {
		res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/login">Login</a>
      </div>
    `);
	}
});

router.get("/protected", requireAuth, (req: Request, res: Response) => {
  res.send('protected content');
});

router.get("/logout", (req: Request, res: Response) => {
	req.session = undefined;
	res.redirect("/");
});

export { router };
