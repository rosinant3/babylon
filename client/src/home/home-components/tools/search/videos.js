import React, { Component } from 'react';
import _ from "underscore";
import gapi from './api/gapi';
import './search-component.css';

import SComponent from './search-component';

class VideoSearch extends Component {

    constructor(props) {
  
        super(props);
        this.state = {

            results: [],
            nextPageToken: false,
            loading: true,
	    value: false,
	    order: false,
	    type: false

        }

	this.isElementInViewPort = this.isElementInViewPort.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
	this.messiah = this.messiah.bind(this);
        this.start = this.start.bind(this);
	this.scrollRef = React.createRef();
	this.youtube_search = _.throttle(this.messiah, 250);

    }

	shouldComponentUpdate(nextProps, nextState) {


		if (nextState.results.length !== this.state.results.length || nextState.value !== this.state.value || nextState.order !== this.state.order || nextState.type !== this.state.type || nextState.loading !== this.state.loading) {

			return true;

		}

		else {

			return false;

		}


	}

	static getDerivedStateFromProps(props, state) {

		if (props.order !== state.order || props.type !== state.type || props.value !== state.value) {
	
			return { order: props.order, type: props.type, value: props.value, nextPageToken: false, loading: true, results: [] }	

		}

		else {

			return null;

		}
		

	}

    start(value, order, type, nextPageToken) {
		window.removeEventListener("scroll", this.youtube_search);
		window.removeEventListener("resize", this.youtube_search);
	let body = {};

	if (nextPageToken) {

	     body = {'maxResults': '20',
                'part': 'snippet',
               'q': `${value}`,
               'type':`${type}`,
                'order':`${order}`,
		'pageToken': `${nextPageToken}`
              }

	}


	if (!nextPageToken) {

	
	body = {'maxResults': '20',
                'part': 'snippet',
               'q': `${value}`,
               'type':`${type}`,
                'order':`${order}`,
              }


	}

        // 2. Initialize the JavaScript client library.
           window.gapi.client.init({ 
               'apiKey': 'AIzaSyC2ug6S36OHIhJ0ndNgm0rkA7dLRCCJ5_0',
               // clientId and scope are optional if auth is not required.
               'clientId': '786495793352-25apkhlgdh2bqld49daa22h8g61ou6va.apps.googleusercontent.com',
               'scope': 'profile',
                }).then(function() {
               // 3. Initialize and make the API request.
               return window.gapi.client.request({ 
               'path': 'https://www.googleapis.com/youtube/v3/search',
               'params': body
               })
               }).then((data) => {
		
		let results = this.state.results.slice();

		data.result.items.forEach((item) => {

			results.push(item);

		});

		 if (data.result.nextPageToken) {

                    
                this.setState({

                    results: results,
                    nextPageToken: data.result.nextPageToken,
                    loading: false

                });

		window.addEventListener("scroll", this.youtube_search);
		window.addEventListener("resize", this.youtube_search);


                }

                else {

                    this.setState({

                    nextPageToken: false,
                    loading: false

                });

		window.removeEventListener("scroll", this.youtube_search);
		window.removeEventListener("resize", this.youtube_search);

                }

               }
               ).catch((error) => {console.log(error)});

   }

	

   componentDidMount() {

	if (this.state.order && this.state.type && this.state.value) {

		
    let order = this.state.order;
    let value = this.state.value;
    let type = this.state.type;
   

    window.gapi.load('client', () => {

        this.start(value, order, type, this.state.nextPageToken);

    });




	}
    
   }

	componentDidUpdate(prevProps, prevState) {


		if (prevState.order !== this.state.order || prevState.type !== this.state.type || prevState.value !== this.state.value) {


					
    			let order = this.state.order;
    			let value = this.state.value;
    			let type = this.state.type;
   
			this.setState({loading: true});

    			window.gapi.load('client', () => {

        			this.start(value, order, type, this.state.nextPageToken);

    			});
	

		}
	


	}

	componentWillUnmount() {

		window.removeEventListener("scroll", this.youtube_search);
		window.removeEventListener("resize", this.youtube_search);


	}

	messiah() {

		let order = this.state.order;
    		let value = this.state.value;
    		let type = this.state.type;
		let target = this.scrollRef.current;
		let realThis = this;

		if (target) {

		this.onVisibilityChange(target, () => {
			
				this.setState({loading: true});
	
    				window.gapi.load('client', () => {

        			this.start(value, order, type, this.state.nextPageToken);

    					});




			}, realThis);
	
	 }


	}

	onVisibilityChange(el, callback, realThis) {

        let visible = realThis.isElementInViewPort(el);

            if (visible) {
                
                if (typeof callback === "function") {

                    callback();

                }
            }

       };
	
	   
   isElementInViewPort(el) {
     
        let rect = el.getBoundingClientRect();
        let innHT;
        let innHB;

        if ((window.innerWidth || document.documentElement.clientWidth) <= 900) {

            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 50;

        }

        if ((window.innerWidth || document.documentElement.clientWidth) > 900) {

         
            innHT = 0;
            innHB = (window.innerHeight || document.documentElement.clientHeight) + 50;
   
        }

	 return (

            rect.top >= innHT &&
            rect.left >= 0 &&
            rect.bottom <= innHB && 
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) 

        );

}

    render() {
        
        let type = this.props.type;
        let order = this.props.order;
	let ring;

        if (this.state.loading === true) {

            ring = <div className="center"><div className="center"><div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>;

        }

            return <section className="results">
            <div className="first-results">
            {this.state.results.map((data, index) => {

			let key;		
	
		if (data.id.videoId) {

			key = data.id.videoId + index;

		}

		if (data.id.playlistId) {

			key = data.id.playlistId + index;

		}

		if (data.id.channelId) {


			key = data.id.channelId + index;

		}
  
                return <SComponent 

		    url_id = {this.props.url_id}
		    id = {this.props.id}
		    reason = {this.props.reason}
                    key = {key}
                    info = {data}
                    type = {type}
                    order = {order}

                />;


            })
            }
            </div>{ring}
            <div ref={this.scrollRef}>
		
            </div>
		
            </section>;
  
    }

};

export default VideoSearch;
