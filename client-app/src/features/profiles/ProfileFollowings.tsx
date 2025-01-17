import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, TabPane } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings(){
    const {profileStore} = useStore();
    const {profile,followings,loadingFollowings,activeTab}= profileStore;



    return (
        <TabPane loading={loadingFollowings}>
            <Grid>
                <Grid.Column>
                    <Header 
                        floated="left" 
                        icon='user' 
                        content={activeTab===3 ? `People following ${profile?.displayName}` : `People ${profile?.displayName } is following`}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group>
                        {followings.map(profile=>(
                            <ProfileCard key={profile.username} profile={profile}/>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})