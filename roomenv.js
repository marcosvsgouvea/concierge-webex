import moment from "moment";
import dbQuery from "./app/db/dev/dbQuery";
const jsxapi = require('jsxapi');

const main = async () => {
   
    const listRoomQuery = `SELECT * FROM "concierge"."rooms" ORDER BY id DESC`;

    try {
        var { rows } = await dbQuery.query(listRoomQuery)
        const rooms = rows;

        for (const room of rooms) {

            jsxapi.connect(`wss://${room.ip}`, {
                username: room.username,
                password: room.password
            }).on('error', async (error) => {
                console.log(error)
            }).on('ready', async (xapi) => {

                xapi.command('UserInterface Extensions Panel Save', { PanelId: 'PANEL_AV' },
                    `<Extensions>
                    <Version>1.7</Version>
                    <Panel>
                      <Order>2</Order>
                      <PanelId>PANEL_AV</PanelId>
                      <Type>Statusbar</Type>
                      <Icon>Tv</Icon>
                      <Color>#00D6A2</Color>
                      <Name>Video</Name>
                      <ActivityType>Custom</ActivityType>
                      <Page>
                        <Name>Video</Name>
                        <Row>
                          <Name>Row</Name>
                          <Widget>
                            <WidgetId>NAME_VIDEO</WidgetId>
                            <Name>Select what to watch on the right TV</Name>
                            <Type>Text</Type>
                            <Options>size=4;fontSize=normal;align=center</Options>
                          </Widget>
                          <Widget>
                            <WidgetId>TV2_VIDEO</WidgetId>
                            <Type>GroupButton</Type>
                            <Options>size=4;columns=1</Options>
                            <ValueSpace>
                              <Value>
                                <Key>VCONF</Key>
                                <Name>Video Conference - Default</Name>
                              </Value>
                              <Value>
                                <Key>GNEWS</Key>
                                <Name>Watch GloboNews</Name>
                              </Value>
                              <Value>
                                <Key>CNNB</Key>
                                <Name>Watch CNN Brasil</Name>
                              </Value>
                              <Value>
                                <Key>BBG</Key>
                                <Name>Watch Bloomberg</Name>
                              </Value>
                            </ValueSpace>
                          </Widget>
                          <Widget>
                            <WidgetId>widget_9</WidgetId>
                            <Type>Spacer</Type>
                            <Options>size=1</Options>
                          </Widget>
                        </Row>
                        <PageId>PAGE_AV</PageId>
                        <Options>hideRowNames=1</Options>
                      </Page>
                      <Page>
                        <Name>Extras</Name>
                        <Row>
                          <Name>Oops!</Name>
                          <Widget>
                            <WidgetId>NAME_WARNING</WidgetId>
                            <Name> This page should be used only by the support</Name>
                            <Type>Text</Type>
                            <Options>size=4;fontSize=normal;align=center</Options>
                          </Widget>
                        </Row>
                        <Row>
                          <Name>Credenza Lift</Name>
                          <Widget>
                            <WidgetId>LIFT_CONFIG</WidgetId>
                            <Type>GroupButton</Type>
                            <Options>size=4;columns=1</Options>
                            <ValueSpace>
                              <Value>
                                <Key>UP</Key>
                                <Name>Up</Name>
                              </Value>
                              <Value>
                                <Key>DOWN</Key>
                                <Name>Down</Name>
                              </Value>
                            </ValueSpace>
                          </Widget>
                          <Widget>
                            <WidgetId>widget_13</WidgetId>
                            <Type>Spacer</Type>
                            <Options>size=1</Options>
                          </Widget>
                        </Row>
                        <Row>
                          <Name>Left TV</Name>
                          <Widget>
                            <WidgetId>TV1_CONFIG</WidgetId>
                            <Type>GroupButton</Type>
                            <Options>size=4;columns=2</Options>
                            <ValueSpace>
                              <Value>
                                <Key>ON</Key>
                                <Name>On</Name>
                              </Value>
                              <Value>
                                <Key>OFF</Key>
                                <Name>Off</Name>
                              </Value>
                              <Value>
                                <Key>HDMI1</Key>
                                <Name>Input HDMI 1</Name>
                              </Value>
                              <Value>
                                <Key>MAGIC</Key>
                                <Name>Input Magic Info</Name>
                              </Value>
                              <Value>
                                <Key>VOL0</Key>
                                <Name>Volume 0</Name>
                              </Value>
                              <Value>
                                <Key>VOL25</Key>
                                <Name>Volume 25</Name>
                              </Value>
                              <Value>
                                <Key>VOL50</Key>
                                <Name>Volume 50</Name>
                              </Value>
                              <Value>
                                <Key>VOL75</Key>
                                <Name>Volume 75</Name>
                              </Value>
                              <Value>
                                <Key>GNEWS</Key>
                                <Name>Globo News</Name>
                              </Value>
                              <Value>
                                <Key>CNNB</Key>
                                <Name>CNN Brasil</Name>
                              </Value>
                              <Value>
                                <Key>BBG</Key>
                                <Name>Bloomberg</Name>
                              </Value>
                              <Value>
                                <Key>0</Key>
                                <Name/>
                              </Value>
                            </ValueSpace>
                          </Widget>
                          <Widget>
                            <WidgetId>widget_11</WidgetId>
                            <Type>Spacer</Type>
                            <Options>size=1</Options>
                          </Widget>
                        </Row>
                        <Row>
                          <Name>Right TV</Name>
                          <Widget>
                            <WidgetId>TV2_CONFIG</WidgetId>
                            <Type>GroupButton</Type>
                            <Options>size=4;columns=2</Options>
                            <ValueSpace>
                              <Value>
                                <Key>ON</Key>
                                <Name>On</Name>
                              </Value>
                              <Value>
                                <Key>OFF</Key>
                                <Name>Off</Name>
                              </Value>
                              <Value>
                                <Key>HDMI1</Key>
                                <Name>Input HDMI 1</Name>
                              </Value>
                              <Value>
                                <Key>MAGIC</Key>
                                <Name>Input Magic Info</Name>
                              </Value>
                              <Value>
                                <Key>VOL0</Key>
                                <Name>Volume 0</Name>
                              </Value>
                              <Value>
                                <Key>VOL25</Key>
                                <Name>Volume 25</Name>
                              </Value>
                              <Value>
                                <Key>VOL50</Key>
                                <Name>Volume 50</Name>
                              </Value>
                              <Value>
                                <Key>VOL75</Key>
                                <Name>Volume 75</Name>
                              </Value>
                              <Value>
                                <Key>GNEWS</Key>
                                <Name>Globo News</Name>
                              </Value>
                              <Value>
                                <Key>CNNB</Key>
                                <Name>CNN Brasil</Name>
                              </Value>
                              <Value>
                                <Key>BBG</Key>
                                <Name>Bloomberg</Name>
                              </Value>
                              <Value>
                                <Key>0</Key>
                                <Name/>
                              </Value>
                            </ValueSpace>
                          </Widget>
                          <Widget>
                            <WidgetId>widget_10</WidgetId>
                            <Type>Spacer</Type>
                            <Options>size=1</Options>
                          </Widget>
                        </Row>
                        <PageId>PAGE_EXTRAS</PageId>
                        <Options>hideRowNames=0</Options>
                      </Page>
                    </Panel>
                  </Extensions>`).then(result => {
                    console.log('result => ', result)
                    xapi.close()
                    res.json(result)
                }).catch(error => {
                    console.log('erro => ', error)
                });

            });
        }
    } catch (error) {
        console.log(error)
    }
}

export   { main }
