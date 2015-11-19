import java.io.*;
import java.net.*;
import java.util.*;

public class Server {

	public static void main(String args[]) {

		ServerSocket socket;
		int port = 8080;

		try{
			socket = new ServerSocket(port);
		} catch (IOException e) {
			System.out.println("error binding port: " + e);
			return;
		}

		System.out.println("Listening on port "+port+"...");
		System.out.println("ctrl-c to quit");

		while (true) {

			try {

				Socket remote = socket.accept();

				BufferedReader in = new BufferedReader(new InputStreamReader(remote.getInputStream()));
				PrintStream out = new PrintStream(remote.getOutputStream());

				// Reading get request
				String str;	
				str = in.readLine();

				// Parsing get request
				String[] request = str.split("\\s");
				String filename = request[1];

				if (filename.length() > 1)
					filename = filename.substring(1);
				else
					filename = "index.html" ;

				try {

					InputStream f = new FileInputStream(filename);

					out.println("HTTP/1.0 200 OK");
					out.println("Content-Type: text/html");
					out.println("");

					byte[] a=new byte[4096];
					int n;
					while ((n=f.read(a))>0)
						out.write(a, 0, n);

					out.close();
					out.flush();
					remote.close();

				} catch (FileNotFoundException e){

					out.println("HTTP/1.0 404 Not Found");
					out.println("Content-Type: text/html");
					out.println("Content-lenght: 0");
					out.println("");
					out.println("Not found 404");
					out.close();
					out.flush();
					remote.close();
					System.out.println("error: " + e);
				}
			
			} catch (Exception e) {
				System.out.println("error: " + e);
			}
		}

	}
}