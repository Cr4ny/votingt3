import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {GroupService} from "../group.service";

interface PollingResultsPublish {
  topic: string,
  message: string | { event: string, voting : number[], participant : string, question_id: string}, // base64 encoding
  title: string,
  tags: string[],
  attach: string,
}

interface QuestionResponse {
  id: string,
  topic: string,
  title: string,
  message: string | {
    "event": "question_event",
    "questions" : string[],
    darkmode:boolean
  },
  tags: string[],
  attachment: {
    "name": string,
    "url": string
  }
}

@Component({
  selector: 'app-vote-selector',
  templateUrl: './vote-selector.component.html',
  styleUrls: ['./vote-selector.component.css']
})
export class VoteSelectorComponent implements OnInit{

  groupName: string | null = "";
  questionsTopic : string = "topic_question_event_tester";
  questionId : string = "";
  questions ? : string[];
  voted: boolean = false;
  darkmode: boolean = false;

  constructor(private http: HttpClient, private zone : NgZone, private route: ActivatedRoute, private groupService : GroupService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe( params => {
      this.groupName = params.get("group");
      if(this.groupName){
        this.groupService.groupName = this.groupName;
      }
      console.log(this.groupName);
      if(this.darkmode){
        document.body.classList.add('dark-mode');
      }else{
        document.body.classList.remove('dark-mode');
      }
    });

    const eventSource = new EventSource(`https://ntfy.sh/${this.groupName + "_question_topic"}/sse`);
    eventSource.onmessage = (eventWrapper) => {
      this.zone.run(
        () => {
          this.voted = false; //allow voting again
          const actualEvent : QuestionResponse = this.decodeMessageFromBase64(JSON.parse(eventWrapper.data));
          this.questionId = actualEvent.id;


          // decoded already
          if (typeof actualEvent.message !== "string") {
            this.questions = actualEvent.message.questions;
            this.groupService.hasQuestions = true;
            this.darkmode = actualEvent.message.darkmode;
            if(this.darkmode){
              document.body.classList.add('dark-mode');
            }else{
              document.body.classList.remove('dark-mode');
            }
          }
          console.log(actualEvent);
        }
      )
    };

    return;
  }

  encodeMessageToBase64(payload : PollingResultsPublish) : PollingResultsPublish {
    payload.message = btoa(JSON.stringify(payload.message));
    return payload;
  }

  decodeMessageFromBase64( payload : QuestionResponse) : QuestionResponse {
    if (typeof payload.message === "string") {
      payload.message = JSON.parse(atob(payload.message));
    }
    return payload;
  }

  voteForQuestion(voteSelectionIndex: number) {
    if(!this.questions) return

    // Wait for the others
    this.voted = true;
    this.groupService.hasQuestions = false;

    // handle vote
    const voting : number[] = Array(this.questions.length).fill(0);
    voting[voteSelectionIndex] = 1;
    const message =  {
      event: "poll_event",
      question_id: this.questionId,
      voting : voting,
      voteType: this.questions[0], //added by me
      participant : "biocarl" // TODO This you will retrieve from the frontend
    };

    const payload : PollingResultsPublish = {
      topic: this.groupName + "_poll_topic", // TODO Will eventually extracted from route root/:groupname
      message: message,
      title: "Publish polling results",
      tags: [],
      attach: ""
    }

    this.http.post<any>('https://ntfy.sh', this.encodeMessageToBase64(payload))
      .subscribe(result => {
        console.log("Post request sent" + result)
      });
  }
}
