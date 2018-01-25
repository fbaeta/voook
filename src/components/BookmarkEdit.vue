<template>
<v-card>
  <v-toolbar color="white" flat>
    <v-btn icon light
      @click.stop="back">
      <v-icon>arrow_back</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" flat @click.stop="save">Save</v-btn>
  </v-toolbar>
  <v-form>
    <v-container grid-list-xl fluid>
      <v-text-field
        v-model="url"
        label="URL"
        disabled
        required>
      </v-text-field>
      <v-text-field
        v-model="title"
        label="Title"
        :disabled="!isNew"
        required>
      </v-text-field>
      <v-text-field
        v-model="author"
        label="Author"
        :disabled="!isNew"
        required>
      </v-text-field>
      <v-text-field
        v-model="tags"
        label="Tags">
      </v-text-field>
      <v-layout wrap>
        <v-flex sm3>
          <v-text-field
            v-model="width"
            type="number"
            label="Width"
            suffix="px"
            :disabled="!isNew"
            v-if="hasSize"
            required>
          </v-text-field>
        </v-flex>
        <v-flex sm2>
          <v-text-field
            v-model="height"
            type="number"
            label="Height"
            suffix="px"
            :disabled="!isNew"
            v-if="hasSize"
            required>
          </v-text-field>
        </v-flex>
        <v-flex sm3>
          <v-text-field
        v-model="duration"
        type="number"
        label="Duration"
        suffix="seconds"
        v-if="hasDuration"
        :disabled="!isNew"
        required>
      </v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</v-card>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import {
  addBookmark,
  getBookmark,
  updateBookmark,
  IBookmark,
  Bookmark,
  BookmarkFactory,
  PhotoBookmark,
  VideoBookmark
} from "../store/bookmarks";
import bookmarks from "../api/bookmarks";
import BookmarkList from "./About.vue";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

@Component({
  name: "bookmark-edit"
})
export default class BookmarkEdit extends Vue {
  public bookmark: Bookmark;
  public isNew: boolean = false;
  public url: string = "";
  public title: string = "";
  public author: string = "";
  public width: number;
  public height: number;
  public duration: number;
  public tags: string = "";

  public get hasSize() {
    return (
      BookmarkFactory.isVimeo(this.url) || BookmarkFactory.isFlickr(this.url)
    );
  }

  public get hasDuration() {
    return BookmarkFactory.isVimeo(this.url);
  }

  public back() {
    this.$router.push("/bookmarks");
  }

  public save() {
    let b: Bookmark | null;
    const tags = this.tags.split(/'\W;'/gi);
    if (this.bookmark != null) {
      b = this.bookmark.clone();
      b.tags = tags;
    } else {
      const args: any = {
        author: this.author,
        date: new Date(),
        title: this.title,
        tags,
        url: this.url
      };
      b = BookmarkFactory.create(args);
    }
    if (b != null) {
      if (b instanceof PhotoBookmark || b instanceof VideoBookmark) {
        b.width = this.width;
        b.height = this.height;
      }
      if (b instanceof VideoBookmark) {
        b.duration = this.duration * 1000;
      }
      let promise;
      if (this.isNew) {
        promise = addBookmark(this.$store, b);
      } else {
        promise = updateBookmark(this.$store, b);
      }
      promise.then(() => {
        this.back();
      });
    }
  }

  public copy(value: any) {
    if (value.url != null) {
      this.url = value.url;
    } else {
      this.url = "";
    }
    if (value.author != null) {
      this.author = value.author;
    } else {
      this.author = "";
    }
    if (value.title != null) {
      this.title = value.title;
    } else {
      this.title = "";
    }
    if (value.width != null) {
      this.width = value.width;
    }
    if (value.height != null) {
      this.height = value.height;
    }
    if (value.duration != null) {
      this.duration = value.duration / 1000;
    }
    if (value.tags != null) {
      if (Array.isArray(value.tags)) {
        this.tags = value.tags.join(", ");
      } else {
        this.tags = value.tags.toString();
      }
    } else {
      this.tags = "";
    }
  }
  public beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name == "new") {
        vm.isNew = true;
        const url = window.atob(to.params.url);
        //TODO fetch tags provider
        vm.copy({
          url: url
        });
      } else {
        vm.isNew = false;
        const bookmark = getBookmark(vm.$store, to.params.id);
        if (bookmark) {
          vm.copy(bookmark);
          vm.bookmark = bookmark;
        } else {
          vm.back();
        }
      }
    });
  }

  public beforeRouteUpdate(to, from, next) {
    next();
  }

  public beforeRouteLeave(to, from, next) {
    next();
  }
}
</script>
<style scoped>

</style>
