import { Router } from "express";
import { zodValidate } from "../../middleware/validation";
import {
  commentValidation,
  createPostValidation,
  likeValidation,
  updatePostValidation,
} from "./post.validation";
import { PostController } from "./post.controller";
import passport from "passport";

const router = Router();

router
  .route("/create")
  .post(
    passport.authenticate("jwt", { session: false }),
    zodValidate(createPostValidation),
    PostController.createPost,
  );
router
  .route("/")
  .get(
    passport.authenticate("jwt", { session: false }),
    PostController.getPosts,
  );
router
  .route("/comments")
  .post(
    passport.authenticate("jwt", { session: false }),
    zodValidate(commentValidation),
    PostController.addComment,
  );
router
  .route("/likes")
  .patch(
    passport.authenticate("jwt", { session: false }),
    zodValidate(likeValidation),
    PostController.likeAction,
  );
router
  .route("/comments")
  .get(
    passport.authenticate("jwt", { session: false }),
    PostController.getComments,
  );
router
  .route("/:id")
  .patch(zodValidate(updatePostValidation), PostController.updatePost);
router.route("/:id").get(PostController.getPost);
router.route("/:id").delete(PostController.deletePost);

export const PostRouter = router;
