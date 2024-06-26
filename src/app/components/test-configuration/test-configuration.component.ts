import { Component } from '@angular/core';
import { QuestionService } from "../../services/question.service";
import { map } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { Question } from "../../model/Question";
import { GameService } from "../../services/game.service";
import { Router } from "@angular/router";

export type SelectedTopic = {
  topic: string,
  selected: boolean
}

@Component({
  selector: 'app-test-configuration',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './test-configuration.component.html',
  styleUrl: './test-configuration.component.scss'
})
export class TestConfigurationComponent {

  topics: SelectedTopic[] | null = null;

  availableQuestions = [ 5, 10, 15, 20 ];

  selectedQuestions = 5;

  constructor(private questionService: QuestionService, private gameService: GameService, private router: Router) {
    questionService.topics.pipe(map(topics => topics.map(t => ({ topic: t, selected: false})))).subscribe(t => this.topics = t)
  }

  toggleSelection(topic: SelectedTopic) {
    topic.selected = !topic.selected;
  }

  play() {
    if (this.topics != null) {
      let selectedTopics = this.topics.filter(topic => topic.selected)
                                               .map(t => t.topic);

      this.questionService.getQuestions(this.selectedQuestions, selectedTopics)
                          .subscribe(qs => this.startGame(qs));
    }
  }

  startGame(questions: Question[]) {
    this.gameService.startGame(questions)
    this.router.navigate([ `game/1` ])
  }

  get topicsSelected() {
    if (this.topics != null) {
      return this.topics.some(t => t.selected)
    }

    return false
  }

}
